import { shuffleArray } from "./random.js";

import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'

const defaultData = {
  collection: []
}

const db = await JSONFilePreset(config.final.good_path, defaultData)
const baddb = await JSONFilePreset(config.final.bad_path, defaultData)

await db.read()
await baddb.read()

db.data.collection = shuffleArray(db.data.collection)
baddb.data.collection = shuffleArray(baddb.data.collection)

await db.write()
await baddb.write()