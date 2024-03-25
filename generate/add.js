import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)

let pExample = {
  if: "Clifford",
  a: 2,
  b: 2,
  c: 0.7,
  d: 0.7,
  p: {
    x: 0,
    y: 0,
  },
  isw: 0.1,
  iss: "s",
  steps: 2,
  color: "black"
}

let collection = []

const ifs = ["Clifford", "de Jong", "Svensson", "Rampe"]

const isss = ["s", "c", "i", "f", "b"]

const colors = ["black", "indigo", "darkolivegreen", "navy", "sienna"]

const size = Math.floor(Number(process.argv.slice(2)[0]))

function generate() {
  db.read()
  for (let i = 0; i < size; i++){
    let p = {}
    p.if = randomItem(ifs)

    p.a = randomFloat(1.5, 5)
    p.b = randomFloat(1.5, 5)
    
    if (p.if === "de Jong") {
      p.c = randomFloat(1.5, 5)
      p.d = randomFloat(1.5, 5)
    } else {
      p.c = 0.7
      p.d = 0.7
    }

    p.p = {}
    p.p.x = randomFloat(-2, 2)
    p.p.y = randomFloat(-2, 2)
    p.isw = randomFloat(0.01, 1)
    p.iss = randomItem(isss)
    p.steps = randomInt(2, 20)
    p.color = randomItem(colors)

    collection.push(p)
  }

  let existingRecords = db.data.collection.length
  console.log(`Existing records: ${existingRecords}`)
  db.data.collection = db.data.collection.concat(collection)
  db.write()
  console.log(`Added records: ${db.data.collection.length-existingRecords}`)
  console.log(`Total records: ${db.data.collection.length}`)
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomFloat(min, max) {
  return Number((Math.random()*(max-min) + min).toFixed(3))
}

function randomInt(min, max) {
  return Math.floor(randomFloat(min, max))
}

generate()