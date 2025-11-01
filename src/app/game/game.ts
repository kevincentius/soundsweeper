import { adjDiag, EnemyData } from "./enemy-data";
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

  maxHp = 5;
  hp = this.maxHp;
  hearts = new Array(this.hp).fill(true);
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
        cell.sounds.forEach((sound, index) => cell.sounds[index].delayMs = index * 250);
      });
    });

    // setup palette
    this.palette = this.cfg.enemies.map(([enemyData, count]) => ({
      enemyData,
      flagged: 0,
      countTotal: count,
    }));

    // randomly reveal 1 silent tile
    for (let attempt = 0; attempt < 1000; attempt++) {
      const i = Math.floor(Math.random() * cfg.height);
      const j = Math.floor(Math.random() * cfg.width);
      const cell = this.board[i][j];
      if (!cell.enemyData && !cell.sounds.length && !cell.revealed) {
        this.tileClick(i, j);
        break;
      }
    }
  }

  tileClick(i: number, j: number) {
    if (!this.isPlaying) { return; }

    const tile = this.board[i][j];
    if (tile.revealed) {
      this.playTileAdjSounds(i, j);
    } else if (tile.flag) {
      // do nothing
    } else if (tile.enemyData) {
      // hit enemy
      soundService.play(soundData.damage);
      this.changeHp(-tile.enemyData.damage);

      // remove flag
      if (tile.flag) {
        this.palette.find(pe => pe.enemyData === tile.flag)!.flagged--;
      }
      // add flag
      this.palette.find(pe => pe.enemyData === tile.enemyData)!.flagged++;
      
      if (this.hp <= 0) {
        this.revealAllEnemies();
        this.killerPos = [i, j];
        this.isPlaying = false;
      } else {
        tile.revealed = true;
      }
    } else {
      this.board[i][j].revealed = true;
      this.playTileAdjSounds(i, j);

      // check victory
      const allRevealed = this.board.every(row => row.every(cell => cell.revealed || cell.enemyData));
      if (allRevealed) {
        soundService.play(soundData.win);
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

  changeHp(delta: number) {
    this.hp += delta;
    this.hearts = new Array(this.maxHp).fill(true).map((_, index) => index < this.hp);
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
      this.revealDueToSilence(i, j);
    }
  }

  playPaletteSound(enemyData: EnemyData) {
    const sounds = [...new Set(enemyData.soundMatrix.flatMap(row => row.flatMap(keys => keys)))];
    shuffleArray(sounds);

    sounds.forEach((key, index) => {
      setTimeout(() => {
        soundService.play(soundDataMap[key]);
      }, index * 250);
    });
  }

  private revealDueToSilence(i: number, j: number) {
    const checked: Set<string> = new Set();
    const toCheck: [number, number][] = [[i, j]];
    while (toCheck.length > 0) {
      const [ci, cj] = toCheck.pop()!;
      const key = `${ci},${cj}`;
      if (!checked.has(key)) {
        checked.add(key);
        const cell = this.board[ci][cj];
        if (cell.sounds.length === 0) {
          cell.revealed = true;
          adjDiag.forEach(([di, dj]) => {
            const ni = ci + di;
            const nj = cj + dj;
            const isInside = ni >= 0 && ni < this.cfg.height && nj >= 0 && nj < this.cfg.width;
            if (isInside && !this.board[ni][nj].revealed) {
              this.board[ni][nj].revealed = true;
              toCheck.push([ni, nj]);
            }
          });
        }
      }
    }
  }
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
