import { Component } from '@angular/core';
import { Game } from '../../game/game';
import { defaultGameConfig } from '../../game/game-config';
import { EnemyData } from '../../game/enemy-data';

@Component({
  selector: 'app-game-component',
  imports: [],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  cfg = defaultGameConfig;
  game = new Game(defaultGameConfig);
  selectedEnemyData: EnemyData | null = null;

  onNewGameClick() {
    this.game = new Game(this.cfg);
  }

  onCellClick(i: number, j: number) {
    this.game.tileClick(i, j);
  }

  onCellRightClick(event: MouseEvent, i: number, j: number) {
    event.preventDefault();
    this.game.tileRightClick(i, j, this.selectedEnemyData);
  }

  onPaletteClick(enemyData: EnemyData) {
    this.selectedEnemyData = enemyData;
  }
}
