#!/bin/bash

# Define the number of iterations
iterations=40

# Run the npm script command in a loop
for ((i=0; i<$iterations; i++)); do
  npm run train --model-name 
done
