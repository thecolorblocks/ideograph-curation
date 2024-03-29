import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)
const baddb = await JSONFilePreset(config.baddb_path, defaultData)

// 80-20 split for training and testing
