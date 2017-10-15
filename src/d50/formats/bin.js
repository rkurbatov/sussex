// @flow

import { readFile } from 'fs'
import { parsePatchCommon, parseToneCommon, parsePartial, parseString } from '../converters'

import type { D50Dump, D50Patch } from '../types'

export const readBinFile = async (fileName: string): Promise<D50Dump> =>
  new Promise((resolve, reject) => {
    readFile(fileName, (err, binary) => {
      if (err) return reject(err)
      resolve(parseBinData(splitBin(binary)))
    })
  })

const parseBinData = (data: Array<Uint8Array>): D50Dump => {
  return {
    patches: data.map(parseBinaryPatch)
  }
}

const parseBinaryPatch = (data: Uint8Array): D50Patch => {
  const binaryData = offset => data.subarray(offset, offset + 64)

  const options = { }
  return {
    name: parseString(data.subarray(0, 18)),
    common: parsePatchCommon(binaryData(404), options),
    upperTone: {
      common: parseToneCommon(binaryData(276), options),
      partial1: parsePartial(binaryData(20)),
      partial2: parsePartial(binaryData(84)),
    },
    lowerTone: {
      common: parseToneCommon(binaryData(340), options),
      partial1: parsePartial(binaryData(148)),
      partial2: parsePartial(binaryData(212)),
    }
  }
}

function splitBin(data: Uint8Array): Array<Uint8Array> {
  const CHUNK_LEN = 468
  const SIGNATURE = "KoaBankFile00003PG-D50"
  if (String.fromCharCode(...data.subarray(0, SIGNATURE.length)) !== SIGNATURE) {
    throw new Error("Wrong BIN file format")
  }
  let arr = []
  let offset = SIGNATURE.length
  while (offset < data.length) {
    arr.push(data.subarray(offset, offset + CHUNK_LEN))
    offset += CHUNK_LEN
  }
  return arr
}
