import { Component } from '@angular/core';
import { Game } from '../../game/game';
import { defaultGameConfig } from '../../game/game-config';

@Component({
  selector: 'app-game-component',
  imports: [],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  public cfg = defaultGameConfig;
  public game = new Game(defaultGameConfig);

  onCellClick(i: number, j: number) {
    this.game.tileClick(i, j);
  }
}
