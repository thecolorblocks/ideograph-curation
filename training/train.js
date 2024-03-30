import * as tf from '@tensorflow/tfjs-node';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { n, ds } from './preprocess.js';
import rootdir from '../rootdir.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const epochs = 500

const earlyStoppingCallback = tf.callbacks.earlyStopping({
  monitor: 'acc',
  minDelta: 0.001,
  patience: 10,
  verbose: 1,
  mode: 'auto'
})

/*
// Initialize model topology
const model = tf.sequential();
model.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [n]}));
model.add(tf.layers.dense({units: 64, activation: 'relu'}));
model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
*/

// Load model
const model = await tf.loadLayersModel(`${rootdir}/training/model/model.json`)

// Compile the model with the Adam optimizer and binary crossentropy loss
model.compile({
  optimizer: tf.train.adam(),
  loss: 'binaryCrossentropy',
  metrics: ['accuracy']
});

// Fit the model using the training data
try {
  model.fitDataset(ds, {
    epochs: epochs,
    callbacks: [earlyStoppingCallback]
  }).then(info => {
    console.log('Training is complete');
    console.log(info);
  });
} catch (error) {
  console.log(error)
}

await model.save(`file://${__dirname}/model`)