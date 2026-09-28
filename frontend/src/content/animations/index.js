// Registry of animated explanations, keyed by the lesson's subtopic number
// ('101.2'). A lesson without an entry shows only its written theory.
import fractions1011 from './fractions/101-1';
import fractions1012 from './fractions/101-2';
import fractions1013 from './fractions/101-3';
import fractions1014 from './fractions/101-4';
import fractions1015 from './fractions/101-5';
import fractions1016 from './fractions/101-6';
import order1021 from './order-of-operations/102-1';
import average1031 from './average/103-1';
import percentage1041 from './percentage/104-1';

const registry = {
  '101.1': fractions1011,
  '101.2': fractions1012,
  '101.3': fractions1013,
  '101.4': fractions1014,
  '101.5': fractions1015,
  '101.6': fractions1016,
  '102.1': order1021,
  '103.1': average1031,
  '104.1': percentage1041,
};

/** Scenes for a lesson, or null. */
export function getScenes(subtopicNumber) {
  return registry[String(subtopicNumber)] || null;
}

export default registry;
