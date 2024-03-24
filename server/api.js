import express from "express"
import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)

const app = express()
const port = 8000

app.get('/', async (req, res) => {
  res.json('The STRANGE IDEOGRAPH curation API server.')
})

app.get('/items/:page', async (req, res) => {
  const page = Math.floor(Number(req.params.page))
  const itemsPerPage = 100
  const start = page * itemsPerPage
  await db.read()
  let items = db.data.collection.slice(start, start+itemsPerPage)
  let response = {}
  if (items.length > 0) {
    response.ok = true
    response.message = `Retrieved items from ${start} to ${start+items.length-1}.`,
    response.data = items
  } else {
    response.ok = false
    response.message = `Page ${page} is out of range.`,
    response.data = []
  }
  res.json(response)
})

app.delete('/item/:index', async (req, res) => {
  let index = Math.floor(Number(req.params.index))
  let item = db.data.collection[index]
  await db.read()
  db.data.collection.splice(index, 1)
  await db.write()
  res.json({
    ok: true,
    message: `Deleted item at ${index}.`,
    data: item
  })
})

app.get('/stats', async (req, res) => {
  await db.read()
  let stats = {
    total: db.data.collection.length
  }

  res.json({
    ok: true,
    message: 'Retrieved statistics.',
    data: stats
  })
})

app.get('/curate', async (req, res) => {
  const html = __dirname + '/curate.html'
  res.sendFile(html)
})

app.listen(port, () => {
  console.log(`STRANGE IDEOGRAPH server listening on port ${port}...`)
})