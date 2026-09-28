import { render } from '@testing-library/react';
import registry, { getScenes } from './index';

// Every registered scene set renders each step without throwing and has a caption.
describe('animation registry', () => {
  test.each(Object.keys(registry))('%s renders every step', (key) => {
    const scenes = getScenes(key);
    expect(scenes.length).toBeGreaterThan(0);
    for (const scene of scenes) {
      expect(scene.name).toBeTruthy();
      expect(scene.steps.length).toBeGreaterThan(0);
      for (const step of scene.steps) {
        expect(typeof step.caption).toBe('string');
        const { container, unmount } = render(<svg viewBox="0 0 640 280">{step.draw()}</svg>);
        expect(container.querySelector('svg').childElementCount).toBeGreaterThan(0);
        unmount();
      }
    }
  });

  test('unknown subtopic gives null', () => {
    expect(getScenes('999.9')).toBeNull();
  });
});
