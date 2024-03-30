function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomFloat(min, max) {
  return Number((Math.random()*(max-min) + min).toFixed(3))
}

function randomInt(min, max) {
  return Math.floor(randomFloat(min, max))
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export {
	randomItem, randomFloat, randomInt, shuffleArray
}