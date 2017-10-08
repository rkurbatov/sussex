// @flow

const fs = require('fs')

export const readSyxFile = async (fileName: string): Promise<Array<Uint8Array>> =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, binary) => {
      if (err) return reject(err)
      resolve(splitSysEx(binary))
    })
  })

function splitSysEx(data: Uint8Array): Array<Uint8Array> {
  let sysexes = []
  let offset = -1
  for (let i=0; i<data.length; i++) {
    if (data[i] === 0xf7) {
      const sysex = data.subarray(offset+1, i+1)
      if (sysex[0] !== 0xf0) {
        throw new Error('Wrong SYX file format')
      }
      sysexes.push(sysex)
      offset = i
    }
  }
  return sysexes
}
