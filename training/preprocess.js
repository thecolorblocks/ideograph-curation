import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'
import * as tf from '@tensorflow/tfjs-node';
import constants from '../generate/constants.js';
import { randomInt, shuffleArray } from '../generate/random.js';

async function preprocess(modelname) {
  const defaultData = {
    collection: []
  }
  const db = await JSONFilePreset(config[modelname].good_path, defaultData)
  const baddb = await JSONFilePreset(config[modelname].bad_path, defaultData)
  
  // Assumption: baddb is bigger than db, which is a safe assumption
  const startIndex = randomInt(0, baddb.data.collection.length - db.data.collection.length)
  const badShuffled = shuffleArray(baddb.data.collection)
  const badDownsampled = badShuffled.slice(startIndex, startIndex+db.data.collection.length)
  
  console.log(`Good sample size: ${db.data.collection.length}`)
  console.log(`Bad sample size (downsampled): ${badDownsampled.length}`)
  console.log(`Bad sample randomized: ${startIndex}`)
  
  const n = 10
  
  function* data() {
    for (let i = 0; i < db.data.collection.length; i++){
      let item = db.data.collection[i]
      yield tf.tensor([
        constants.IFS.indexOf(item.if),
        item.a,
        item.b,
        item.c,
        item.d,
        item.p.x,
        item.p.y,
        item.isw,
        constants.ISSS.indexOf(item.iss),
        item.steps
      ])
    }
  
    for (let j = 0; j < badDownsampled.length; j++){
      let item = badDownsampled[j]
      yield tf.tensor([
        constants.IFS.indexOf(item.if),
        item.a,
        item.b,
        item.c,
        item.d,
        item.p.x,
        item.p.y,
        item.isw,
        constants.ISSS.indexOf(item.iss),
        item.steps
      ])
    }
  }
  
  function* labels() {
    for (let i = 0; i < db.data.collection.length; i++){
      yield tf.tensor([1])
    }
  
    for (let j = 0; j < badDownsampled.length; j++){
      yield tf.tensor([0])
    }
  }
  
  const xs = tf.data.generator(data)
  const ys = tf.data.generator(labels)
  const ds = tf.data.zip({xs, ys}).shuffle(100).batch(32)

  return ds
}

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)
const baddb = await JSONFilePreset(config.baddb_path, defaultData)

// Assumption: baddb is bigger than db, which is a safe assumption
const startIndex = randomInt(0, baddb.data.collection.length - db.data.collection.length)
const badShuffled = shuffleArray(baddb.data.collection)
const badDownsampled = badShuffled.slice(startIndex, startIndex+db.data.collection.length)

console.log(`Good sample size: ${db.data.collection.length}`)
console.log(`Bad sample size (downsampled): ${badDownsampled.length}`)
console.log(`Bad sample randomized: ${startIndex}`)

const n = 10

function normalize(inputData) {
  let input = [...inputData]
  let family = constants.IFS[input[0]]
  input[0] = input[0] / 3
  input[1] = (input[1] - 1.5) / (5-1.5)
  input[2] = (input[2] - 1.5) / (5-1.5)
  // Only normalize when family is de Jongs
  if (family == 'de Jong') {
    input[3] = (input[3] - 1.5) / (5-1.5)
    input[4] = (input[4] - 1.5) / (5-1.5)
  }
  input[5] = input[5] / 4 + 0.5
  input[6] = input[6] / 4 + 0.5
  input[7] = (input[7] - 0.01) / (1-0.01)
  input[8] = input[8] / 4
  input[9] = input[9] / 10

  return input
}

function* data() {
  for (let i = 0; i < db.data.collection.length; i++){
    let item = db.data.collection[i]
    yield tf.tensor([
      constants.IFS.indexOf(item.if),
      item.a,
      item.b,
      item.c,
      item.d,
      item.p.x,
      item.p.y,
      item.isw,
      constants.ISSS.indexOf(item.iss),
      item.steps
    ])
  }

  for (let j = 0; j < badDownsampled.length; j++){
    let item = badDownsampled[j]
    yield tf.tensor([
      constants.IFS.indexOf(item.if),
      item.a,
      item.b,
      item.c,
      item.d,
      item.p.x,
      item.p.y,
      item.isw,
      constants.ISSS.indexOf(item.iss),
      item.steps
    ])
  }
}

function* labels() {
  for (let i = 0; i < db.data.collection.length; i++){
    yield tf.tensor([1])
  }

  for (let j = 0; j < badDownsampled.length; j++){
    yield tf.tensor([0])
  }
}

const xs = tf.data.generator(data)
const ys = tf.data.generator(labels)
const ds = tf.data.zip({xs, ys}).shuffle(100).batch(32)

export {
  n, ds, normalize, preprocess
}
