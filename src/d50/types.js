// @flow

export type D50Address = [number, number, number]
export type D50BinarySysEx = Uint8Array
export type D50ReverbData = Uint8Array

export type D50SysexHeader = {
  vendorId: number,
  deviceId: number,
  modelId: number,
  commandId: number,
  address: D50Address,
  checksum: number,
}

export type D50Dump = {
  patches: Array<D50Patch>,
  reverbData?: Array<D50ReverbData>,
}

export type D50Patch = {
  name?: string,
  common: D50PatchCommon,
  upperTone: D50PatchTone,
  lowerTone: D50PatchTone,
}

export type D50PatchTone = {
  partial1: D50TonePartial,
  partial2: D50TonePartial,
  common: D50ToneCommon,
}

export type D50PatchCommon = {
  name: string,
  keyMode: number,
  splitPoint: number,
  portamentoMode: number,
  holdMode: number,
  upperToneKeyShift: number,
  lowerToneKeyShift: number,
  upperToneFineTune: number,
  lowerToneFineTune: number,
  benderRange: number,
  afterTouchBendRange: number,
  portamentoTime: number,
  outputMode: number,
  reverbType: number,
  reverbBalance: number,
  totalVolume: number,
  toneBalance: number,
  chaseMode: number,
  chaseLevel: number,
  chaseTime: number,
  midiTransmitChannel: number,
  midiSeparateRcvChannel: number,
  midiProgChange: number,
}

export type D50ToneCommon = {
  name: string,
  structure: number,
  pEnv: {
    velocityRange: number,
    timeKeyFollow: number,
    time: [number, number, number, number],
    level: [number, number, number],
    sustainLevel: number,
    endLevel: number,
  },
  modulation: {
    lfoDepth: number,
    pitchLever: number,
    pitchAfterTouch: number,
  },
  lfo1: {
    waveform: number,
    rate: number,
    delayTime: number,
    sync: number,
  },
  lfo2: {
    waveform: number,
    rate: number,
    delayTime: number,
    sync: number,
  },
  lfo3: {
    waveform: number,
    rate: number,
    delayTime: number,
    sync: number,
  },
  eq: {
    lowFrequency: number,
    lowGain: number,
    highFrequency: number,
    highQ: number,
    highGain: number,
  },
  chorus: {
    type: number,
    rate: number,
    depth: number,
    balance: number,
  },
  partialMute: number,
  partialBalance: number,
}

export type D50TonePartial = {
  wg: D50PartialWG,
  tvf: D50PartialTVF,
  tva: D50PartialTVA,
}

type D50PartialWG = {
  pitch: {
    coarse: number,
    fine: number,
    keyFollow: number,
  },
  modulation: {
    lfoMode: number,
    pEnvMode: number,
    bendMode: number,
  },
  waveform: number,
  pcmWave: number,
  pulseWidth: {
    amount: number,
    velocityRange: number,
    lfoSelect: number,
    lfoDepth: number,
    afterTouchRange: number,
  },
}

type D50PartialTVF = {
  cutoffFrequency: number,
  resonance: number,
  keyFollow: number,
  biasPoint: number,
  biasLevel: number,
  env: {
    depth: number,
    velocityRange: number,
    depthKeyFollow: number,
    timeKeyFollow: number,
    time: [number, number, number, number, number],
    level: [number, number, number],
    sustainLevel: number,
    endLevel: number,
  },
  modulation: {
    lfoSelect: number,
    lfoDepth: number,
    afterTouchRange: number,
  },
}

type D50PartialTVA = {
  level: number,
  velocityRange: number,
  biasPoint: number,
  biasLevel: number,
  env: {
    time: [number, number, number, number, number],
    level: [number, number, number],
    sustainLevel: number,
    endLevel: number,
    velocityFollow: number,
    timeKeyFollow: number,
  },
  modulation: {
    lfoSelect: number,
    lfoDepth: number,
    afterTouchRange: number,
  }
}