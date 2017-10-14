// @flow

import { readSyxFile } from './d50/formats'

readSyxFile('./demo/PND50-00.syx')
  .then((parsed)=> {
    console.log('success!!')
    console.log(JSON.stringify(parsed.patches[0], null, 2))
  })