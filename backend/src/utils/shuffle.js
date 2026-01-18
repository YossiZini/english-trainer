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

module.exports = { shuffleArray };
