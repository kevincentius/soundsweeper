import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from "./view/game-component/game-component";
import { soundService } from './game/sound/sound-service';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('soundsweeper');

  loaded = signal(false);
  
  constructor() {
    soundService.loadingCounter.progress.subscribe(progress => {
      if (progress >= 1) {
        setTimeout(() => {
          this.loaded.set(true);
        });
      }
    });
  }
}
