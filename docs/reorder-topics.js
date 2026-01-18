const fs = require('fs');
const path = require('path');

// Mapping: old topic number -> new topic number
const topicMapping = {
  1: 9,   // Present Simple -> 9
  2: 3,   // Personal Pronouns -> 3
  3: 5,   // Articles -> 5
  4: 4,   // Nouns -> 4 (stays same)
  5: 2,   // Verb To Be -> 2
  6: 7,   // There is/are -> 7
  7: 6,   // Demonstratives -> 6
  8: 8,   // Adjectives -> 8 (stays same)
  9: 13,  // Prepositions of Place -> 13
  10: 14, // Prepositions of Time -> 14
  11: 15, // Past Simple -> 15
  12: 11, // Present Progressive -> 11
  13: 1,  // Grammar Basics -> 1
  14: 17, // Future Simple -> 17
  15: 16, // Going to -> 16
  16: 12, // Can/Could -> 12
  17: 18, // Comparatives -> 18
  18: 10  // Question Words -> 10
};

// Read the file
const filePath = path.join(__dirname, 'topics.md');
const content = fs.readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');

// Find topic boundaries
const topics = {};
let currentTopic = null;
let currentLines = [];
let headerLines = [];
let inHeader = true;

for (const line of lines) {
  // Check if this is a topic header
  const topicMatch = line.match(/^## Topic (\d+):/);

  if (topicMatch) {
    // Save header if we're still in header section
    if (inHeader) {
      headerLines = currentLines;
      currentLines = [];
      inHeader = false;
    }

    // Save previous topic if exists
    if (currentTopic !== null) {
      topics[currentTopic] = currentLines.join('\n');
      currentLines = [];
    }

    // Start new topic
    currentTopic = parseInt(topicMatch[1]);
    currentLines.push(line);
  } else {
    currentLines.push(line);
  }
}

// Save last topic
if (currentTopic !== null) {
  topics[currentTopic] = currentLines.join('\n');
}

console.log('Found topics:', Object.keys(topics).sort((a, b) => a - b).join(', '));

// Create new content with reordered topics
let newContent = headerLines.join('\n') + '\n\n';

// Add topics in new order (1-18)
for (let newNum = 1; newNum <= 18; newNum++) {
  // Find which old topic should be at this position
  const oldNum = Object.keys(topicMapping).find(key => topicMapping[key] === newNum);

  if (oldNum && topics[oldNum]) {
    let topicContent = topics[oldNum];

    // Replace the topic number in the header
    topicContent = topicContent.replace(
      /^## Topic (\d+):/,
      `## Topic ${newNum}:`
    );

    // Replace subtopic numbers (e.g., "### 13.1" -> "### 1.1")
    topicContent = topicContent.replace(
      new RegExp(`### ${oldNum}\\.(\\d+)`, 'g'),
      `### ${newNum}.$1`
    );

    // Replace subtopic references in text
    topicContent = topicContent.replace(
      new RegExp(`(Subtopic |subtopic )${oldNum}\\.(\\d+)`, 'g'),
      `$1${newNum}.$2`
    );

    newContent += topicContent + '\n\n---\n\n';
    console.log(`Placed old Topic ${oldNum} as new Topic ${newNum}`);
  } else {
    console.log(`Warning: No content found for new Topic ${newNum} (should be old Topic ${oldNum})`);
  }
}

// Write the new file
const outputPath = path.join(__dirname, 'topics-reordered.md');
fs.writeFileSync(outputPath, newContent.trim() + '\n');

console.log('\n✅ Reordered topics written to:', outputPath);
console.log('\nNew order:');
console.log('1. Grammar Basics (was 13)');
console.log('2. Verb "To Be" (was 5)');
console.log('3. Personal Pronouns (was 2)');
console.log('4. Nouns (was 4)');
console.log('5. Articles (was 3)');
console.log('6. Demonstratives (was 7)');
console.log('7. There is/are (was 6)');
console.log('8. Adjectives (was 8)');
console.log('9. Present Simple (was 1)');
console.log('10. Question Words (was 18)');
console.log('11. Present Progressive (was 12)');
console.log('12. Can/Could (was 16)');
console.log('13. Prepositions of Place (was 9)');
console.log('14. Prepositions of Time (was 10)');
console.log('15. Past Simple (was 11)');
console.log('16. Going to (was 15)');
console.log('17. Future Simple (was 14)');
console.log('18. Comparatives (was 17)');
console.log('\nReview the file, then run: mv docs/topics-reordered.md docs/topics.md');
