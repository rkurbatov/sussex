// @flow

import { readFile } from 'fs'
import { D50Memory } from '../Memory'
import { D50Sysex } from '../Sysex'
import { parsePatchCommon, parseToneCommon, parsePartial } from '../converters'

import type { D50Dump, D50BinarySysEx, D50Patch } from '../types'

export const readSyxFile = async (fileName: string): Promise<D50Dump> =>
  new Promise((resolve, reject) => {
    readFile(fileName, (err, binary) => {
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
  const binaryData = offset => data.subarray(offset, offset + 64)

  const options = { rolandStrings: true }
  return {
    common: parsePatchCommon(binaryData(384), options),
    upperTone: {
      common: parseToneCommon(binaryData(128), options),
      partial1: parsePartial(binaryData(0)),
      partial2: parsePartial(binaryData(64)),
    },
    lowerTone: {
      common: parseToneCommon(binaryData(320), options),
      partial1: parsePartial(binaryData(192)),
      partial2: parsePartial(binaryData(256)),
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
