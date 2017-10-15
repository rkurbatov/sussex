// @flow

import { readBinFile } from './d50/formats'

readBinFile('./demo/1 Preset.bin')
  .then((parsed)=> {
    console.log('success!!')
    //console.log(JSON.stringify(parsed.patches[0], null, 2))
  })