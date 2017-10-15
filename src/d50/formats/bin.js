// @flow

import { readFile, writeFile } from 'fs'
import {
  parsePatchCommon,
  parseToneCommon,
  parsePartial,
  parseString,
  encodePatchCommon,
  encodeToneCommon,
  encodePartial,
  encodeString
} from '../converters'

import type { D50Dump, D50Patch } from '../types'
type BinaryPatch = Uint8Array

const SIGNATURE = "KoaBankFile00003PG-D50"
const BINARY_PATCH_LEN = 18 + 2 + 64 * 7  // patchName + 0x0000 + 7*64 bytes of patch data:
                                          // upperPartial1, upperPartial2, lowerPartial1, lowerPartial2
                                          // upperCommon1, upperCommon2, patchCommon
const BINARY_DUMP_LEN = SIGNATURE.length + 64 * BINARY_PATCH_LEN

export const readBinFile = async (fileName: string): Promise<D50Dump> =>
  new Promise((resolve, reject) => {
    readFile(fileName, (err, binary) => {
      if (err) return reject(err)
      resolve(parseBinDump(splitBin(binary)))
    })
  })

export const writeBinFile = async (fileName: string, dump: D50Dump) => {
  new Promise((resolve, reject) => {
    const binDump = exportBinDump(dump)
    writeFile(fileName, new Buffer(binDump), (err) => {
      if (err) return reject(err)
      resolve(true)
    })
  })
}

const parseBinDump = (binDump: Array<BinaryPatch>): D50Dump => {
  return {
    patches: binDump.map(parseBinaryPatch)
  }
}

const exportBinDump = (dump: D50Dump): Uint8Array => {
  const binaryDump = new Uint8Array(BINARY_DUMP_LEN)

  const binSignature = encodeString(SIGNATURE)
  binaryDump.set(binSignature, 0)

  const binPatches = dump.patches.map(encodeBinaryPatch)
  binPatches.forEach((binaryPatch: BinaryPatch, i) => {
    binaryDump.set(binaryPatch, SIGNATURE.length + i * BINARY_PATCH_LEN)
  })

  return binaryDump
}

const parseBinaryPatch = (binaryPatch: BinaryPatch): D50Patch => {
  const binaryData = i => binaryPatch.subarray(20 + i*64, 20 + (i+1)*64)

  const options = { }
  return {
    name: parseString(binaryPatch.subarray(0, 18)),
    common: parsePatchCommon(binaryData(6), options),
    upperTone: {
      common: parseToneCommon(binaryData(4), options),
      partial1: parsePartial(binaryData(0)),
      partial2: parsePartial(binaryData(1)),
    },
    lowerTone: {
      common: parseToneCommon(binaryData(5), options),
      partial1: parsePartial(binaryData(2)),
      partial2: parsePartial(binaryData(3)),
    }
  }
}

const encodeBinaryPatch = (patch: D50Patch): BinaryPatch => {
  const binaryPatch = new Uint8Array(BINARY_PATCH_LEN)
  const binaryName = encodeString(patch.name || patch.common.name, 18)
  binaryPatch.set(binaryName, 0)

  return binaryPatch
}

function splitBin(data: Uint8Array): Array<Uint8Array> {
  if (String.fromCharCode(...data.subarray(0, SIGNATURE.length)) !== SIGNATURE) {
    throw new Error("Wrong BIN file format")
  }
  let arr = []
  let offset = SIGNATURE.length
  while (offset < data.length) {
    arr.push(data.subarray(offset, offset + BINARY_PATCH_LEN))
    offset += BINARY_PATCH_LEN
  }
  return arr
}
