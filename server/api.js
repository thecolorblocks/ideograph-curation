import express from "express"
import { JSONFilePreset } from 'lowdb/node'
import config from '../config.js'
import Mustache from 'mustache'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { promises as fs } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const defaultData = {
  collection: []
}
const db = await JSONFilePreset(config.db_path, defaultData)
const baddb = await JSONFilePreset(config.baddb_path, defaultData)

const app = express()
const port = 8000

const mustacheParams = {
  style: {
    mainnet: '/content/9c42dd1d4779e1e181c606fdebef484d49666d83bdfea2704ea71287388bc187i0',
  },
  gzipLibLoader: {
    mainnet: '/content/638cc09410ed2c92f4dc2ac4356ac7521ad77d1bdff8e1708668619495de7c31i0',
  },
  algo: {
    mainnet: '/content/25de377d9cae39afbb77cc6d885de282ba86c4956765e45dc71a4539f6a22e21i0',
  },
  dependencies: {
    mainnet: '/content/e985b96e00c33cd3ec2856bb246a340c4335e5e6094930658cebba06a5517a30i0',
  },
}

let mustacheParamsCopy = {...mustacheParams}

for (let key in mustacheParamsCopy) {
  mustacheParamsCopy[key].mainnet = `https://ordinals.com${mustacheParamsCopy[key].mainnet}`
}

app.get('/', async (req, res) => {
  res.json('The STRANGE IDEOGRAPH curation API server.')
})

app.get('/items/:page', async (req, res) => {
  const page = Math.floor(Number(req.params.page))
  const itemsPerPage = 20
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
  await baddb.read()
  await db.read()
  baddb.data.collection.push(db.data.collection[index])
  await baddb.write()
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

app.get('/curate/item/:b64', async (req, res) => {
  let params = Buffer.from(req.params.b64, 'base64').toString('utf-8')

  const mustachePath = __dirname + '/ideographViewer.mustache'
  const mustacheStr = await fs.readFile(mustachePath, 'utf8')
  const htmlStr = Mustache.render(mustacheStr, {
    style: mustacheParamsCopy.style.mainnet,
    gzipLibLoader: mustacheParamsCopy.gzipLibLoader.mainnet,
    algo: mustacheParamsCopy.algo.mainnet,
    dependencies: mustacheParamsCopy.dependencies.mainnet,
    paramsJSON: params
  })

  res.send(htmlStr)
})

app.listen(port, () => {
  console.log(`STRANGE IDEOGRAPH server listening on port ${port}...`)
})