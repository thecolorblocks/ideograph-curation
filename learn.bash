#!/bin/bash

# Define the number of iterations
iterations=2

# Run the npm script command in a loop
for ((i=0; i<$iterations; i++)); do
  npm run train
done