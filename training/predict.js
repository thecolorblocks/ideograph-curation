import * as tf from '@tensorflow/tfjs-node';
import rootdir from '../rootdir.js';
import constants from '../generate/constants.js';
import { randomItem, randomFloat, randomInt } from '../generate/random.js'

import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)

const model = await tf.loadLayersModel(`${rootdir}/training/model/model.json`)

const threshold = 0.7
const iterations = 1000
let data = []
let params = []

function randomInput() {
  let input = []
  let params = {}
  // if
  params.if = randomItem(constants.IFS)
  input.push(constants.IFS.indexOf(params.if))
  // a and b
  params.a = randomFloat(1.5, 5)
  params.b = randomFloat(1.5, 5)
  input.push(params.a)
  input.push(params.b)
  // c and d
  if (input[0] === 1) {
    params.c = randomFloat(1.5, 5)
    params.d = randomFloat(1.5, 5)
    input.push(params.c)
    input.push(params.d)
  } else {
    params.c = 0.7
    params.d = 0.7
    input.push(0.7)
    input.push(0.7)
  }
  // x and y
  params.p = {}
  params.p.x = randomFloat(-2, 2)
  params.p.y = randomFloat(-2, 2)
  input.push(params.p.x)
  input.push(params.p.y)
  // isw
  params.isw = randomFloat(0.01, 1)
  input.push(params.isw)
  // iss
  params.iss = randomItem(constants.ISSS)
  input.push(constants.ISSS.indexOf(params.iss))
  // steps
  params.steps = randomInt(2, 7)
  input.push(params.steps)
  // colors
  params.color = randomItem(constants.COLORS)
  input.push(constants.COLORS.indexOf(params.color))
  
  return {input, params}
}

for (let i = 0; i < iterations; i++) {
  let result = randomInput()
  data.push(result.input)
  params.push(result.params)
}

const inputData = tf.tensor2d(data, [data.length, 11])

const predictions = model.predict(inputData)

let inputsAboveThreshold = []
let paramsAboveThreshold = []

// Get inputs above threshold
predictions.arraySync().forEach((p, idx) => {
  if (p > threshold) {
    inputsAboveThreshold.push(data[idx])
    paramsAboveThreshold.push(params[idx])
  }
})

console.log(`Iterations: ${iterations}`)
console.log(`Threshold: ${threshold}`)
console.log(`Above threshold: ${paramsAboveThreshold.length}`)

// Add predicted positive parameters to database db.json
db.read()
for (let i = 0; i < paramsAboveThreshold.length; i++) {
  db.data.collection.push(paramsAboveThreshold[i])
  db.write()
}
console.log('Wrote to db.json')
