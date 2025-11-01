import { Howl } from "howler";
import { Subject } from "rxjs";

export class SoundInstance {
  howl: Howl;
  endSubject = new Subject<void>();
  
  playId?: number;
  fadeOutTimeout: any;

  constructor(
    src: string,
  ) {
    this.howl = new Howl({
      src: [src],
      preload: false,
    });

    if (Howler.usingWebAudio) { console.log("Howl.js is using Web Audio API."); } else { console.log("Howl.js is using HTML5 Audio."); }
  }

  load(): Promise<void> {
    return new Promise(resolve => {
      this.howl.on('load', () => resolve());
      this.howl.on('loaderror', () => {
        console.error('Failed to load sound', (this.howl as any)._src, this.howl);
        resolve();
      });
      this.howl.on('end', () => this.endSubject.next());
      this.howl.load();
    });
  }

  setVolume(volume: number) {
    this.howl.volume(volume);
  }

  playing() {
    return this.howl.playing();
  }

  play() {
    if (this.fadeOutTimeout) {
      clearTimeout(this.fadeOutTimeout);
      this.fadeOutTimeout = undefined;
    }

    this.howl.loop(false);
    this.playId = this.howl.play();
  }

  loop() {
    this.howl.loop(true);
    this.playId = this.howl.play();
  }

  stop() {
    this.howl.stop();
  }

  seek(time: number) {
    if (this.playId == undefined) {
      console.warn('Seeking before playing');
    }
    this.howl.seek(time, this.playId);
  }

  fadeOut(duration: number, startVolume: number) {
    if (this.playId == undefined) {
      console.warn('Seeking before fadeOut');
    }
    this.howl.fade(startVolume, 0, duration, this.playId);
    this.fadeOutTimeout = setTimeout(() => {
      this.howl.stop(this.playId);
      this.fadeOutTimeout = undefined;
    }, duration);
  }

  duration() {
    return this.howl.duration();
  }
}
