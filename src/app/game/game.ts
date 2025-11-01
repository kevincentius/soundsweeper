import { EnemyData } from "./enemy-data";
import { GameConfig } from "./game-config";
import { soundData, soundDataMap } from "./sound/sound";
import { soundService } from "./sound/sound-service";

export interface Cell {
  enemyData?: EnemyData;
  sounds: {
    key: string;
    volume: number;
    delayMs: number;
  }[];
  flipped: boolean;
  revealed: boolean;
  flag: EnemyData | null;
}

export interface PaletteEntry {
  enemyData: EnemyData;
  flagged: number;
  countTotal: number;
}

export class Game {
  public board: Cell[][];
  public palette: PaletteEntry[];

  isPlaying = true;
  victory = false;

  hp = 3;
  score = 0;

  killerPos: [number, number] | null = null;

  constructor(private cfg: GameConfig) {
    this.board = new Array(cfg.height).fill(0).map(() => new Array(cfg.width).fill(0).map(() => ({
      flipped: Math.random() < 0.5,
      sounds: [],
      revealed: false,
      flag: null,
    })));

    // place enemies
    for (const [enemy, count] of cfg.enemies) {
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
                      delayMs: Math.random() * 400,
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
        // cell.sounds.forEach((sound, index) => cell.sounds[index].delayMs = index * 200);
        // cell.sounds.forEach((sound, index) => cell.sounds[index].delayMs = index * 200);
      });
    });

    // setup palette
    this.palette = this.cfg.enemies.map(([enemyData, count]) => ({
      enemyData,
      flagged: 0,
      countTotal: count,
    }));
  }

  tileClick(i: number, j: number) {
    if (!this.isPlaying) { return; }

    if (this.board[i][j].revealed) {
      this.playTileAdjSounds(i, j);
    } else if (this.board[i][j].flag) {
      // do nothing
    } else if (this.board[i][j].enemyData) {
      this.revealAllEnemies();
      this.killerPos = [i, j];
      this.isPlaying = false;
    } else {
      this.board[i][j].revealed = true;
      this.playTileAdjSounds(i, j);

      // check victory
      const allRevealed = this.board.every(row => row.every(cell => cell.revealed || cell.enemyData));
      if (allRevealed) {
        this.isPlaying = false;
        this.victory = true;
        this.revealAllEnemies();
        this.score += this.hp * 10;
      }
    }
  }

  tileRightClick(i: number, j: number, selectedEnemyData: EnemyData | null) {
    if (!this.isPlaying) { return; }
    
    const cell = this.board[i][j];
    if (cell.revealed) {
      return;
    } else if (cell.flag) {
      // remove flag
      const paletteEntry = this.palette.find(pe => pe.enemyData === cell.flag)!;
      paletteEntry.flagged--;
      cell.flag = null;
    } else if (selectedEnemyData) {
      // add flag
      const paletteEntry = this.palette.find(pe => pe.enemyData === selectedEnemyData)!;
      if (paletteEntry.flagged < paletteEntry.countTotal) {
        paletteEntry.flagged++;
        cell.flag = selectedEnemyData;
      }
    }
  }

  private revealAllEnemies() {
    this.board.forEach(row => {
      row.forEach(cell => {
        if (cell.enemyData) {
          cell.revealed = true;
        }
      });
    });
  }

  private playTileAdjSounds(i: number, j: number) {
    const sounds = this.board[i][j].sounds;
    sounds.forEach(sound => {
      setTimeout(() => {
        console.log(soundDataMap);
        console.log(sound.key);
        soundService.play(soundDataMap[sound.key]);
      }, sound.delayMs);
    });

    if (sounds.length === 0) {
      soundService.play(soundData.cricket);
    }
  }
}
