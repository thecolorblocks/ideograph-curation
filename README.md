### Installation

`npm install`

Code the recompile from source on custom CPU architectures (such as arm64)
`npm rebuild @tensorflow/tfjs-node --build-from-source`

### Commands

#### Run curation server for specific model
`npm run serve -- --model-name [model name]`

#### Run training for specific model
`npm run train -- --model-name [model name]`

#### Run prediction with specific model
`npm run predict -- --model-name [model name] --threshold [threshold] --dry-run`

#### Run curation server for final outputs
`npm run curate`