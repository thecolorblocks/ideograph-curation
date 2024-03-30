import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'
import * as tf from '@tensorflow/tfjs-node';
import constants from '../generate/constants.js';
import { randomInt, shuffleArray } from '../generate/random.js';

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

export {
  n, ds
}
