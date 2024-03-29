import * as tf from '@tensorflow/tfjs';

// Assuming `X_train` and `X_test` are your input tensors and `y_train` and `y_test` are the labels (0 or 1)
// n is the dimensionality of the vectors
const model = tf.sequential();
model.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [n]}));
model.add(tf.layers.dense({units: 64, activation: 'relu'}));
model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));

// Compile the model with the Adam optimizer and binary crossentropy loss
model.compile({
  optimizer: tf.train.adam(),
  loss: 'binaryCrossentropy',
  metrics: ['accuracy']
});

// Fit the model using the training data
model.fit(X_train, y_train, {
  epochs: 10,
  validationData: [X_test, y_test]
}).then(info => {
  console.log('Training is complete');
  console.log(info);
});
