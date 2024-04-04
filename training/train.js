import * as tf from '@tensorflow/tfjs-node';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { n, preprocess } from './preprocess.js';
import rootdir from '../rootdir.js';
import { hasFlag, getParam } from '../command.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const epochs = 500
const sessions = 20

const earlyStoppingCallback = tf.callbacks.earlyStopping({
  monitor: 'loss',
  minDelta: 0.093,
  patience: 10,
  verbose: 1,
  mode: 'auto'
})

// Extract command-line arguments (excluding the first two default elements)
const args = process.argv.slice(2)

const modelname = getParam(args, '--model-name', true)

let model

if (hasFlag(args, '--init')) {
  // Initialize model topology
  model = tf.sequential();
  model.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [n]}));
  model.add(tf.layers.dense({units: 64, activation: 'relu'}));
  model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));  
} else {
  // Load model
  model = await tf.loadLayersModel(`${rootdir}/training/${modelname}/model.json`)
}

// Compile the model with the Adam optimizer and binary crossentropy loss
model.compile({
  optimizer: tf.train.adam(),
  loss: 'binaryCrossentropy',
  metrics: ['accuracy']
});

for (let i = 0; i < sessions; i++) {

  console.log('Training session: ' + i)

  // Preprocess data
  let ds = await preprocess(modelname)

  // Fit the model using the training data
  try {
    let info = await model.fitDataset(ds, {
      epochs: epochs,
      callbacks: [earlyStoppingCallback]
    })
    console.log('Training complete.')
    console.log(info)
  } catch (error) {
    console.log(error)
  }
}

await model.save(`file://${__dirname}/${modelname}`)