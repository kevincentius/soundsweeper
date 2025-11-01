
import { LoadingCounter } from './loading-counter';
import { soundData, SoundData } from './sound';
import { SoundInstance } from './sound-instance';
import { soundLoader } from './sound-loader';

class SoundService {
  map: Map<string, SoundInstance> = new Map();
  loadingCounter = new LoadingCounter();

  constructor() {
    for (let soundKey in soundData) {
      const path = this.getPath(soundKey);
      this.loadingCounter.add(1);
      soundLoader.load(path).then(() => this.loadingCounter.loadedOne());  
      this.map.set(soundKey, soundLoader.get(path));
    }
  }

  private getPath(relName: string) {
    return `snd/${relName}.mp3`;
  }

  play(soundData: SoundData) {
    let entry = this.map.get(soundData.key)!;
    entry.stop();
    entry.play();
  }

  stop(soundData: SoundData) {
    let entry = this.map.get(soundData.key)!;
    entry.stop();
  }

  stopAll() {
    this.map.forEach(entry => {
      entry.stop();
    });
  }
}
export const soundService = new SoundService();
