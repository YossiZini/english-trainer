/**
 * Fisher-Yates shuffle algorithm
 * Properly randomizes array in-place
 * Better than Array.sort(() => Math.random() - 0.5)
 */
function shuffleArray(array) {
  const shuffled = [...array]; // Create a copy to avoid mutating original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * In-place variant, for callers that shuffle an array they already own.
 */
function shuffleInPlace(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = { shuffleArray, shuffleInPlace };
