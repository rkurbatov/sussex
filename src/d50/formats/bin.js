// @flow

const fs = require('fs')

export const readBinFile = async (fileName: string): Promise<Array<Uint8Array>> =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, binary) => {
      if (err) return reject(err)
      resolve(splitBin(binary))
    })
  })

function splitBin(data: Uint8Array): Array<Uint8Array> {
  const CHUNK_LEN = 468
  const SIGNATURE = "KoaBankFile00003PG-D50"
  if (String.fromCharCode(...data.subarray(0, SIGNATURE.length)) !== SIGNATURE) {
    throw new Error("Wrong BIN file format")
  }
  return []
}
