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
const db = await JSONFilePreset(config.final.good_path, defaultData)

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

// Loop
await db.read()

for (let i = 0; i < db.data.collection.length; i++) {
	let params = db.data.collection[i]
	const mustachePath = __dirname + '/../server/ideograph.mustache'
	const mustacheStr = await fs.readFile(mustachePath, 'utf8')
	const htmlStr = Mustache.render(mustacheStr, {
		style: mustacheParams.style.mainnet,
		gzipLibLoader: mustacheParams.gzipLibLoader.mainnet,
		algo: mustacheParams.algo.mainnet,
		dependencies: mustacheParams.dependencies.mainnet,
		paramsJSON: JSON.stringify(params)
	})
  await fs.writeFile(`${__dirname}/mint_files/#${i}.html`, htmlStr)
}