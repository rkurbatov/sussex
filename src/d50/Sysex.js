// @flow

import type { D50SysexHeader, D50BinarySysEx } from './types'

export class D50Sysex {
  header: D50SysexHeader
  data: D50BinarySysEx
  invalidCheckSum: boolean

  constructor (binary: Uint8Array) {
    this.header = getSysexHeader(binary)
    this.data = getSysexData(binary)
    this.invalidCheckSum = calcChecksum(binary) !== this.header.checksum
  }
}

const getSysexHeader = (sysex: Uint8Array): D50SysexHeader => {
  if (sysex.length < 10) {
    throw new Error ('Wrong SysEx header format')
  }
  const aBuf = sysex.subarray(5, 8)
  return {
    vendorId: sysex[1],
    deviceId: sysex[2],
    modelId: sysex[3],
    commandId: sysex[4],
    address: [aBuf[0], aBuf[1], aBuf[2]],
    checksum: sysex[sysex.length-2],
  }
}

const getSysexData = (sysex: Uint8Array): Uint8Array => sysex.subarray(8, sysex.length-2)

const calcChecksum = (sysex: Uint8Array): number => {
  const checkBlock = sysex.subarray(5, sysex.length-2) // address + data
  return 128 - Array.from(checkBlock).reduce((acc, val) => (acc + val), 0) % 128
}