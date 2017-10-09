// @flow

import { readBinFile } from './d50/formats'

readBinFile('./demo/1 Preset.bin')
  .then(()=> {
    console.log('success!!')
  })