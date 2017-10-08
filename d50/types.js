// @flow

export type D50Address = [number, number, number]

export type D50SysexHeader = {
  vendorId: number,
  deviceId: number,
  modelId: number,
  commandId: number,
  address: D50Address,
  checksum: number,
}