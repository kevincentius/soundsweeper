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
    const score = this.game.victory ? this.game.score : 0;
    this.game = new Game(this.cfg);
    this.game.score = score;
  }

  onCellClick(event: Event, i: number, j: number) {
    if (event instanceof MouseEvent) {
      if (event.button === 0) {
        this.game.tileClick(i, j);
      } else if (event.button === 2) {
        this.game.tileRightClick(i, j, this.selectedEnemyData);
      }
    }
  }

  onContextMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onPaletteClick(enemyData: EnemyData) {
    this.selectedEnemyData = enemyData;
    this.game.playPaletteSound(enemyData);
  }
}
