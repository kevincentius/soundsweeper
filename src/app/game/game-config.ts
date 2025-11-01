import { enemyData, EnemyData } from "./enemy-data";

export interface GameConfig {
  tileSize: number;
  width: number;
  height: number;
  enemies: [EnemyData, number][];
  startingLives: number;
}

export const defaultGameConfig: GameConfig = {
  tileSize: 80,
  width: 10,
  height: 8,
  enemies: [
    [enemyData.dragon, 1],
    [enemyData.demon, 2],
    [enemyData.couatl, 2],
    [enemyData.bear, 4],
    [enemyData.dragonBat, 3],
    [enemyData.efreeti, 3],
    [enemyData.vampireBat, 5],
    // [enemyData.dragon, 1],
    // [enemyData.demon, 1],
    // [enemyData.couatl, 1],
    // [enemyData.bear, 3],
    // [enemyData.dragonBat, 2],
    // [enemyData.efreeti, 2],
    // [enemyData.vampireBat, 5],
  ],
  startingLives: 3,
}
