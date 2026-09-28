// Registry of animated explanations, keyed by the lesson's subtopic number
// ('101.2'). A lesson without an entry shows only its written theory.
import fractions1012 from './fractions/101-2';

const registry = {
  '101.2': fractions1012,
};

/** Scenes for a lesson, or null. */
export function getScenes(subtopicNumber) {
  return registry[String(subtopicNumber)] || null;
}

export default registry;
