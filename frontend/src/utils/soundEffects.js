/**
 * Sound Effects Utility
 * Generates sound effects using Web Audio API
 * No external files needed - all sounds generated programmatically
 */

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.3; // 30% volume by default

    // Initialize on user interaction (required by browsers)
    this.initialized = false;
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;

      // Load user preferences from localStorage
      const savedEnabled = localStorage.getItem('soundEffectsEnabled');
      const savedVolume = localStorage.getItem('soundEffectsVolume');

      if (savedEnabled !== null) {
        this.enabled = savedEnabled === 'true';
      }
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.initialized = false;
    }
  }

  /**
   * Play a simple beep tone
   */
  playBeep(frequency = 440, duration = 0.2) {
    if (!this.enabled || !this.initialized) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  }

  /**
   * Play level-up sound (celebratory ascending tones)
   */
  playLevelUp() {
    if (!this.enabled || !this.initialized) return;

    try {
      const notes = [
        { freq: 523.25, time: 0, duration: 0.15 },      // C5
        { freq: 659.25, time: 0.1, duration: 0.15 },    // E5
        { freq: 783.99, time: 0.2, duration: 0.15 },    // G5
        { freq: 1046.50, time: 0.3, duration: 0.4 }     // C6 (held longer)
      ];

      notes.forEach(note => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';

        const startTime = this.audioContext.currentTime + note.time;
        const endTime = startTime + note.duration;

        gainNode.gain.setValueAtTime(this.volume * 0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime);
      });
    } catch (error) {
      console.warn('Error playing level-up sound:', error);
    }
  }

  /**
   * Play achievement unlock sound (magical chime)
   */
  playAchievement() {
    if (!this.enabled || !this.initialized) return;

    try {
      const notes = [
        { freq: 659.25, time: 0, duration: 0.2 },       // E5
        { freq: 830.61, time: 0.05, duration: 0.2 },    // G#5
        { freq: 1046.50, time: 0.1, duration: 0.3 }     // C6
      ];

      notes.forEach(note => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = 'triangle'; // Triangle wave for softer sound

        const startTime = this.audioContext.currentTime + note.time;
        const endTime = startTime + note.duration;

        gainNode.gain.setValueAtTime(this.volume * 0.4, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime);
      });
    } catch (error) {
      console.warn('Error playing achievement sound:', error);
    }
  }

  /**
   * Play correct answer sound (positive ding)
   */
  playCorrect() {
    if (!this.enabled || !this.initialized) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('Error playing correct sound:', error);
    }
  }

  /**
   * Play wrong answer sound (negative buzz)
   */
  playWrong() {
    if (!this.enabled || !this.initialized) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';

      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Error playing wrong sound:', error);
    }
  }

  /**
   * Play points earned sound (coin collection)
   */
  playPoints() {
    if (!this.enabled || !this.initialized) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Error playing points sound:', error);
    }
  }

  /**
   * Enable/disable sound effects
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('soundEffectsEnabled', enabled.toString());
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundEffectsVolume', this.volume.toString());
  }

  /**
   * Get current enabled state
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get current volume
   */
  getVolume() {
    return this.volume;
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

export default soundEffects;
