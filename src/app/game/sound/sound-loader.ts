import { SoundInstance } from "./sound-instance";

/**
 * Central place to get SoundInstance objects.
 */
class SoundLoader {
  private soundMap: Map<string, SoundInstance> = new Map();

  get(path: string) {
    const entry = this.soundMap.get(path);
    if (entry) {
      return entry;
    } else {
      console.warn(`Sound played before being loaded: ${path}`);
      this.load(path)
      return this.soundMap.get(path)!;
    }
  }
  
  async load(path: string) {
    const sound = new SoundInstance(path);
    this.soundMap.set(path, sound);
    return sound.load();
  }
}

export const soundLoader = new SoundLoader();
