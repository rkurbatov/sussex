// @flow

import { readBinFile } from './d50/formats'

readBinFile('./1 Preset.bin')
  .then(()=> {
    console.log('success!!')
  })