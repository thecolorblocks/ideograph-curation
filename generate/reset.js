import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)

console.log('Existing records: ' + db.data.collection.length)

db.data.collection = []

await db.write()

console.log('All reset.')