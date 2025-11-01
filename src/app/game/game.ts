import { EnemyData } from "./enemy-data";
import { GameConfig } from "./game-config";
import { soundDataMap } from "./sound/sound";
import { soundService } from "./sound/sound-service";

export interface Cell {
  enemyData?: EnemyData;
  sounds: {
    key: string;
    volume: number;
    delayMs: number;
  }[];
  flipped: boolean;
}

export class Game {
  public board: Cell[][];

  constructor(private cfg: GameConfig) {
    this.board = new Array(cfg.height).fill(0).map(() => new Array(cfg.width).fill(0).map(() => ({
      flipped: Math.random() < 0.5,
      sounds: [],
    })));

    // place enemies
    for (const [enemy, count] of cfg.enemyMap) {
      for (let n = 0; n < count; n++) {
        let placed = false;
        let tries = 0;
        while (!placed && tries < 100000) {
          tries++;
          const i = Math.floor(Math.random() * cfg.height);
          const j = Math.floor(Math.random() * cfg.width);
          if (!this.board[i][j].enemyData) {
            this.board[i][j].enemyData = enemy;

            // assign sounds to adjacent cells
            const center = Math.floor(enemy.soundMatrix.length / 2);
            enemy.soundMatrix.forEach((row, di) => {
              row.forEach((soundKeys, dj) => {
                const ni = i + di - center;
                const nj = j + dj - center;
                const isInside = ni >= 0 && ni < cfg.height && nj >= 0 && nj < cfg.width;
                if (isInside) {
                  soundKeys.forEach((key, index) => {
                    this.board[ni][nj].sounds.push({
                      key,
                      volume: Math.random() * 0.1 + 0.9,
                      delayMs: Math.random() * 200,
                    });
                  });
                }
              });
            });
            placed = true;
          }
        }
      }
    }

    // TODO: reshuffle sounds with proper time spacing
    this.board.forEach(row => {
      row.forEach(cell => {
        cell.sounds.sort((a, b) => a.delayMs - b.delayMs);
        cell.sounds.forEach((sound, index) => cell.sounds[index].delayMs = index * 500);
      });
    });
  }

  tileClick(i: number, j: number) {
    // play sounds
    this.board[i][j].sounds.forEach(sound => {
      setTimeout(() => {
        console.log(soundDataMap);
        console.log(sound.key);
        soundService.play(soundDataMap[sound.key]);
      }, sound.delayMs);
    });
  }
}
