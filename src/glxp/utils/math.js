import { Vec3 } from '@/glxp/ogl/math/Vec3.js'
import { vec3 } from 'gl-matrix'

const { EPSILON } = Number

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function lerp(min, max, t) {
  return min * (1 - t) + max * t
}

function map(value, minA, maxA, minB, maxB, clamped = false) {
  if (clamped) {
    value = Math.min(maxA, Math.max(minA, value))
  }

  return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB
}

function inverseLerp(min, max, t) {
  if (Math.abs(min - max) < EPSILON) {
    return 0
  }

  return (t - min) / (max - min)
}

function smoothstep(min, max, t) {
  const x = clamp(inverseLerp(min, max, t), 0, 1)
  return x * x * (3 - 2 * x)
}

function mod(a, b) {
  return ((a % b) + b) % b
}

function roundOne(a) {
  return Math.round(a * 10) / 10
}

function FloatArrayToVec3Array(data) {
  const out = []
  for (let i = 0; i < data.length / 3; i++) {
    out.push(new Vec3(data[i * 3 + 0], data[i * 3 + 1], data[i * 3 + 2]))
  }
  return out
}

function FloatArrayToGlMatrixVec3Array(data) {
  const out = []
  for (let i = 0; i < data.length / 3; i++) {
    out.push(vec3.fromValues(data[i * 3 + 0], data[i * 3 + 1], data[i * 3 + 2]))
  }
  return out
}

function HslToHex(h, s, l) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function Smoothstep(min, max, value) {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

const lut = []
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16)
}
function GenerateUID() {
  var d0 = (Math.random() * 0xffffffff) | 0
  var d1 = (Math.random() * 0xffffffff) | 0
  var d2 = (Math.random() * 0xffffffff) | 0
  var d3 = (Math.random() * 0xffffffff) | 0
  return lut[d0 & 0xff] + lut[(d0 >> 8) & 0xff] + lut[(d0 >> 16) & 0xff] + lut[(d0 >> 24) & 0xff] + '-' + lut[d1 & 0xff] + lut[(d1 >> 8) & 0xff] + '-' + lut[((d1 >> 16) & 0x0f) | 0x40] + lut[(d1 >> 24) & 0xff] + '-' + lut[(d2 & 0x3f) | 0x80] + lut[(d2 >> 8) & 0xff] + '-' + lut[(d2 >> 16) & 0xff] + lut[(d2 >> 24) & 0xff] + lut[d3 & 0xff] + lut[(d3 >> 8) & 0xff] + lut[(d3 >> 16) & 0xff] + lut[(d3 >> 24) & 0xff]
}

/**
 * @returns Average of an number array
 * @type {Number}
 */
function getAverage(arr) {
  let sum = 0

  for (let index = 0; index < arr.length; index++) {
    sum = sum + arr[index]
  }

  const avg = sum / arr.length

  return avg !== Infinity ? avg : 0
}

function getVectorAngle(v1, v2) { return Math.atan2(v2[1] - v1[1], v2[0] - v1[0]); }

export { map, mod, lerp, clamp, roundOne, smoothstep, FloatArrayToVec3Array, FloatArrayToGlMatrixVec3Array, Smoothstep, HslToHex, GenerateUID, getAverage, getVectorAngle }
