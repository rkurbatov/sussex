// @flow

import { D50Memory, addressToOffset } from '../Memory'
import { D50Sysex } from '../Sysex'
import { parsePatchCommon, parseToneCommon, parsePartial } from '../converters'

import type { D50Dump, D50BinarySysEx, D50Patch } from '../types'

export const readSyxFile = async (fileName: string): Promise<D50Dump> =>
  new Promise((resolve, reject) => {
    require('fs').readFile(fileName, (err, binary) => {
      if (err) return reject(err)
      resolve(parseSyxData(splitSysEx(binary)))
    })
  })

const parseSyxData = (data: Array<D50BinarySysEx>): D50Dump => {
  const memory = new D50Memory()
  data.forEach(binary => {
    const sysex = new D50Sysex(binary)
    memory.updateMemory(sysex.header.address, sysex.data)
  })
  const patches = Array.from(new Array(64)).map((_, i) => parseBinaryPatch(memory.getBinaryPatch(i)))
  const reverbData = Array.from(new Array(32)).map((_, i) => memory.getBinaryReverb(i))
  return {
    patches,
    reverbData,
  }
}

const parseBinaryPatch = (data: Uint8Array): D50Patch => {
  const upperPartial1Offset = addressToOffset([0x00, 0x00, 0x00])
  const upperPartial2Offset = addressToOffset([0x00, 0x00, 0x40])
  const upperToneCommonOffset = addressToOffset([0x00, 0x01, 0x00])
  const lowerPartial1Offset = addressToOffset([0x00, 0x02, 0x00])
  const lowerPartial2Offset = addressToOffset([0x00, 0x01, 0x40])
  const lowerToneCommonOffset = addressToOffset([0x00, 0x02, 0x40])
  const patchCommonOffset = addressToOffset([0x00, 0x03, 0x00])

  const binaryData = offset => data.subarray(offset, offset + 64)

  const options = { rolandStrings: true }
  return {
    common: parsePatchCommon(binaryData(patchCommonOffset), options),
    upperTone: {
      common: parseToneCommon(binaryData(upperToneCommonOffset), options),
      partial1: parsePartial(binaryData(upperPartial1Offset)),
      partial2: parsePartial(binaryData(upperPartial2Offset)),
    },
    lowerTone: {
      common: parseToneCommon(binaryData(lowerToneCommonOffset), options),
      partial1: parsePartial(binaryData(lowerPartial1Offset)),
      partial2: parsePartial(binaryData(lowerPartial2Offset)),
    }
  }
}

function splitSysEx(data: Uint8Array): Array<D50BinarySysEx> {
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
