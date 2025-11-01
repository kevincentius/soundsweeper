import { Component, signal } from '@angular/core';
import { GameComponent } from "./view/game-component/game-component";
import { soundService } from './game/sound/sound-service';
import { CreditsComponent } from "./view/credits-component/credits-component";

@Component({
  selector: 'app-root',
  imports: [GameComponent, CreditsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('soundsweeper');

  loaded = signal(false);
  gameStarted = signal(false);
  creditsVisible = signal(false);
  
  constructor() {
    soundService.loadingCounter.progress.subscribe(progress => {
      if (progress >= 1) {
        setTimeout(() => {
          this.loaded.set(true);
        });
      }
    });
  }

  onStartClick() {
    this.gameStarted.set(true);
    this.creditsVisible.set(false);
  }
  
  onCreditsClick() {
    this.creditsVisible.set(!this.creditsVisible());
    this.gameStarted.set(!this.creditsVisible());
  }
}
