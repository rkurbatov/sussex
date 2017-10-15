// @flow

import { readSyxFile, readBinFile, writeBinFile } from './d50/formats'

readBinFile('./demo/1 Preset.bin')
  .then((parsed)=> {
    console.log('success!!')
    console.log(parsed.patches.length)
    return writeBinFile('./demo/PND50-00.bin', parsed)
  })