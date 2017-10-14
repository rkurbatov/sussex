// @flow

import type { D50Address, D50ReverbData } from './types'

const PATCH_DATA_LENGTH = 7 * 64 // UP1, UP2, UCommon, LP1, LP2, LCommon, Patch
const REVERB_DATA_LENGTH = 376

const MEM_LEN = PATCH_DATA_LENGTH * 64 + REVERB_DATA_LENGTH * 32 // enough for storing all settings

// Roland D-50 memory structure
// Address is [x, y, z] where x, y, z are 7-bit values (0x00 - 0x7F)

const PATCH_BLOCK_OFFSET = addressToOffset([0x02, 0x00, 0x00])
const REVERB_BLOCK_OFFSET = addressToOffset([0x03, 0x60, 0x00])

export class D50Memory {
  _memory: Uint8Array

  constructor() {
    this._memory = new Uint8Array(MEM_LEN)
  }

  updateMemory (address: D50Address, block: Uint8Array) {
    const offset = addressToOffset(address)
    if (offset + block.length > this._memory.length) {
      throw new Error(`Memory cannot be updated with block of length ${block.length} and offset ${offset}`)
    }
    this._memory.set(block, offset)
  }

  _getBlock (offset: number, length: number): Uint8Array {
    if (offset + length > this._memory.length) {
      throw new Error(`Cannot read memory block of length ${length} and offset ${offset}`)
    }
    return this._memory.subarray(offset, offset + length)
  }

  getBinaryPatch(i: number): Uint8Array {
    const offset = PATCH_BLOCK_OFFSET + i * PATCH_DATA_LENGTH
    return this._getBlock(offset, PATCH_DATA_LENGTH)
  }

  getBinaryReverb(i: number): D50ReverbData {
    const offset = REVERB_BLOCK_OFFSET + i * REVERB_DATA_LENGTH
    return this._getBlock(offset, REVERB_DATA_LENGTH)
  }
}

export function addressToOffset(address: D50Address): number {
  const offset = (address[0] * 128 * 128 + address[1] * 128 + address[2]) - 32768
  if (address.some( n => n < 0 || n > 127) || offset > MEM_LEN - 1) {
    throw new Error('Memory offset is beyond allowed range')
  }
  return offset
}
