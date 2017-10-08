// @flow

import type { D50Address } from './types'

// Roland D-50 memory structure
// Address is [x, y, z] where x, y, z are 7-bit values (0x00 - 0x7F)
const MEM_OFFSET = 32768 // Address [0x02, 0x00, 0x00] - patches start here
const MEM_LEN = 34688    // 135 * 256 + 128 bytes - enough for storing all settings
                         // [0x03, 0x60, 0x00] - reverb data start here

const PATCH_BLOCK_OFFSET = addressToOffset([0x02, 0x00, 0x00])
const PATCH_DATA_LENGTH = 7 * 64 // UP1, UP2, UCommon, LP1, LP2, LCommon, Patch
const REVERB_BLOCK_OFFSET = addressToOffset([0x03, 0x60, 0x00])
const REVERB_DATA_LENGTH = 376

export class RawMemory {
  _memory: Uint8Array

  constructor() {
    this._memory = new Uint8Array(MEM_LEN)
  }

  updateMemory = (address: D50Address, block: Uint8Array) => {
    const offset = addressToOffset(address)
    if (offset + block.length > this._memory.length) {
      throw new Error(`Memory cannot be updated with block of length ${block.length} and offset ${offset}`)
    }
    this._memory.set(block, offset)
  }

  _getBlock = (offset: number, length: number): Uint8Array => {
    if (offset + length > this._memory.length) {
      throw new Error(`Cannot read memory block of length ${length} and offset ${offset}`)
    }
    return this._memory.subarray(offset, offset + length)
  }

  getBinaryPatch(i: number): Uint8Array {
    const offset = PATCH_BLOCK_OFFSET + i * PATCH_DATA_LENGTH
    return this._getBlock(offset, PATCH_DATA_LENGTH)
  }

  getBinaryReverb(i: number): Uint8Array {
    const offset = REVERB_BLOCK_OFFSET + i * REVERB_DATA_LENGTH
    return this._getBlock(offset, REVERB_DATA_LENGTH)
  }
}

function addressToOffset(address: D50Address): number {
  const offset = (address[0] * 128 * 128 + address[1] * 128 + address[2]) - MEM_OFFSET
  if (address.some( n => n < 0 || n > 127) || offset > MEM_LEN - 1) {
    throw new Error('Memory offset is beyond allowed range')
  }
  return offset
}
