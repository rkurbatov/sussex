// @flow

import { readSyxFile, writeBinFile } from './d50/formats'

readSyxFile('./demo/PND50-00.syx')
  .then((parsed)=> {
    console.log('success!!')
    console.log(parsed.patches.length)
    return writeBinFile('./demo/PND50-00.bin', parsed)
  })