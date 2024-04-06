### Introduction

This is the curation toolset used for STRANGE IDEOGRAPH. The curation process is as follows:
1. Random parameters were set for a specific amount of IDEOGRAPH outputs (such as 200), and the artist manually curate from the 200 outputs, leaving a small amount as "Good" outputs, while the deleted ones were "Bad" outputs.
2. "Good" outputs were saved in one database, and "Bad" outputs were saved in another database. This automatically separates and labels the datasets used for training the curation model later.
3. Curation model was constructed. There are a total of 10 input vectors for the 10 different parameters for each IDEOGRAPH (`color` parameter is omitted). There are two hidden layers, each consisted of 64 neurons, with ReLU activation function. There is one neuron in the output layer, with sigmoid activation function, with value closer to `0` as "bad" output, and value closer to `1` as "good" output.
4. Curation model was trained. Training was not intensive to avoid overfitting. This was done through trial and error. `model1a` was trained from the original dataset produced by manual curation. The outputs produced by `model1a` was used to train `model1b`, and `model1b` developed a certain specialty in curating outputs with more defined "light/shadow" contrast traits.
5. The entire collection of 2,000 pieces were curated. Much of the original dataset through manual curation was reorganized, with less "good" and more "bad" outputs to elevate visual quality. The entire curation process took many days. In the end, there were 2,000 "good" outputs, and 9009 "bad" outputs. Almost all of 9009 "bad" outputs were curated by AI models `model1a` and `model1b`, where the average curation rate is 0.4% (with accuracy at or above 0.8), therefore making total outputs curated amounting to around 2,000,000.

### History

1. STRANGE IDEOGRAPH was originally designed to be curated by each collector, therefore making the minting process a gigantic curatorial effort to select the most pleasing IDEOGRAPHs from the infinite state space of the four strange attractors (Clifford, de Jong, Svensson, Rampe).
2. Later, due to technological constraints of the Ordinals protocol in terms of parent/child inscribing, user-curation was ditched, and curatorial effort falls entirely on the artist.
3. The artist realized that curating 2,000 outputs through the curation tool at https://thecolorblocks.co/ideograph will take a very long time, so they built a simple API server with backend JSON database support that automatically generates large amounts of outputs with random parameters.
4. The artist then quickly realized that curating from the random outputs will still take a very long time, since "good" outputs were extremely scarce. The artist then proceed to experiment with neural networks. The artist had no previous experience of training any neural network models.
5. After careful consideration, the artist decided to develop in the node.js environment rather than python, and incorporated different open source libraries. The artist learned about the effects of different activation functions, the role of hidden layers, the early stopping mechanism, etc, and developed this toolset for curation.
6. Eventually, all 2,000 outputs were curated with the help of `model1a` and `model1b`, making this collection AI-assisted curatorial art within a certain range of the state space of four strange attractors.

### Installation

`npm install`

Code the recompile from source on custom CPU architectures (such as arm64)
`npm rebuild @tensorflow/tfjs-node --build-from-source`

### How-to

#### Run curation server for specific model
`npm run serve -- --model-name [model name]`

#### Run training for specific model
`npm run train -- --model-name [model name]`

#### Run prediction with specific model
`npm run predict -- --model-name [model name] --threshold [threshold] --dry-run`

#### Run curation server for final outputs
`npm run curate`

### Credits
- JSON database technology by [lowdb](https://github.com/typicode/lowdb)
- Neural network library: [tensorflow.js](https://www.tensorflow.org/js)
- API server made with [express.js](https://expressjs.com/)
- HTML templating supported by [mustache.js](https://github.com/janl/mustache.js)
- Frontend logic powered by [alpine.js](https://alpinejs.dev/)
- Frontend style beautified by [tailwindcss](https://tailwindcss.com/) (playground)
