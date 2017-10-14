// @flow

import type { D50PatchCommon, D50ToneCommon, D50TonePartial } from './types'

type ParsePatchOptions = {
  rolandStrings?: boolean
}
export const parsePatchCommon = (data: Uint8Array, options: ParsePatchOptions): D50PatchCommon => {
  const p = (i, max) => parseNumber(data[i], max, 'patch')

  const convertChar = options.rolandStrings
    ? (i: number): string => rolandToAscii[i] || ' '
    : (i: number) => String.fromCharCode(i)

  const name = Array.from(data.subarray(0, 18)).map(convertChar).join('')

  return {
    name,
    keyMode: p(18, 8),
    splitPoint: p(19, 60),
    portamentoMode: p(20, 2),
    holdMode: p(21, 2),
    upperToneKeyShift: p(22, 48),
    lowerToneKeyShift: p(23, 48),
    upperToneFineTune: p(24, 100),
    lowerToneFineTune: p(25, 100),
    benderRange: p(26, 12),
    afterTouchBendRange: p(27, 24),
    portamentoTime: p(28, 100),
    outputMode: p(29, 3),
    reverbType: p(30, 31),
    reverbBalance: p(31, 100),
    totalVolume: p(32, 100),
    toneBalance: p(33, 100),
    chaseMode: p(34, 2),
    chaseLevel: p(35, 100),
    chaseTime: p(36, 100),
    midiTransmitChannel: p(37, 16),
    midiSeparateRcvChannel: p(38, 16),
    midiProgChange: p(39, 100),
  }

}

export const parseToneCommon = (data: Uint8Array, options: Object): D50ToneCommon => {
  const p = (i, max) => parseNumber(data[i], max, 'patch')

  const convertChar = options.rolandStrings
    ? (i: number): string => rolandToAscii[i] || ' '
    : (i: number) => String.fromCharCode(i)

  const name = Array.from(data.subarray(0, 10)).map(convertChar).join('')

  return {
    name,
    structure: p(10, 6),
    pEnv: {
      velocityRange: p(11, 2),
      timeKeyFollow: p(12, 4),
      time: [p(13, 50), p(14, 50), p(15, 50), p(16, 50)],
      level: [p(17, 100), p(18, 100), p(19, 100)],
      sustainLevel: p(20, 100),
      endLevel: p(21, 100),
    },
    modulation: {
      lfoDepth: p(22, 100),
      pitchLever: p(23, 100),
      pitchAfterTouch: p(24, 100),
    },
    lfo1: {
      waveform: p(25, 3),
      rate: p(26, 100),
      delayTime: p(27, 100),
      sync: p(28, 2),
    },
    lfo2: {
      waveform: p(29, 3),
      rate: p(30, 100),
      delayTime: p(31, 100),
      sync: p(32, 1)
    },
    lfo3: {
      waveform: p(33, 3),
      rate: p(34, 100),
      delayTime: p(35, 100),
      sync: p(36, 1),
    },
    eq: {
      lowFrequency: p(37, 15),
      lowGain: p(38, 24),
      highFrequency: p(39, 21),
      highQ: p(40, 8),
      highGain: p(41, 24)
    },
    chorus: {
      type: p(42, 7),
      rate: p(43, 100),
      depth: p(44, 100),
      balance: p(45, 100),
    },
    partialMute: p(46, 3),
    partialBalance: p(47, 100)
  }
}

export const parsePartial = (data: Uint8Array): D50TonePartial => {
  const p = (i, max) => parseNumber(data[i], max, 'partial')
  return {
    wg: {
      pitch: {
        coarse: p(0, 72),
        fine: p(1, 100),
        keyFollow: p(2, 16),
      },
      modulation: {
        lfoMode: p(3, 3),
        pEnvMode: p(4, 2),
        bendMode: p(5, 2),
      },
      waveform: p(6, 1),
      pcmWave: p(7, 99),
      pulseWidth: {
        amount: p(8, 100),
        velocityRange: p(9, 14),
        lfoSelect: p(10, 5),
        lfoDepth: p(11, 100),
        afterTouchRange: p(12, 14),
      },
    },
    tvf: {
      cutoffFrequency: p(13, 100),
      resonance: p(14, 30),
      keyFollow: p(15, 14),
      biasPoint: p(16, 127),
      biasLevel: p(17, 14),
      env: {
        depth: p(18, 100),
        velocityRange: p(19, 100),
        depthKeyFollow: p(20, 4),
        timeKeyFollow: p(21, 4),
        time: [p(22, 100), p(23, 100), p(24, 100), p(25, 100), p(26, 100)],
        level: [p(27, 100), p(28, 100), p(29, 100)],
        sustainLevel: p(30, 100),
        endLevel: p(31, 1),
      },
      modulation: {
        lfoSelect: p(32, 5),
        lfoDepth: p(33, 100),
        afterTouchRange: p(34, 14),
      },
    },
    tva: {
      level: p(35, 100),
      velocityRange: p(36, 100),
      biasPoint: p(37, 127),
      biasLevel: p(38, 12),
      env: {
        time: [p(39, 100), p(40, 100), p(41, 100), p(42, 100), p(43, 100)],
        level: [p(44, 100), p(45, 100), p(46, 100)],
        sustainLevel: p(47, 100),
        endLevel: p(48, 1),
        velocityFollow: p(49, 4),
        timeKeyFollow: p(50, 4),
      },
      modulation: {
        lfoSelect: p(51, 5),
        lfoDepth: p(52, 100),
        afterTouchRange: p(53, 14),
      },
    },
  }
}

function parseNumber(n: number, maxValue: number, unit: string): number {
  if (n < 0 || n > maxValue) throw new Error(`Value '${n}' is out of range '${maxValue}' in ${unit}`)
  return n
}

const rolandToAscii = [
  ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
  'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z', '1', '2', '3',
  '4', '5', '6', '7', '8', '9', '0', '-',
]
