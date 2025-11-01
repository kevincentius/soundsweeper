import { enemyData, EnemyData } from "./enemy-data";

export interface GameConfig {
  tileSize: number;
  width: number;
  height: number;
  enemyMap: Map<EnemyData, number>;
  startingLives: number;
}

export const defaultGameConfig: GameConfig = {
  tileSize: 96,
  width: 10,
  height: 8,
  enemyMap: new Map<EnemyData, number>([
    [enemyData.dragon, 1],
    [enemyData.demon, 1],
    [enemyData.couatl, 1],
    [enemyData.bear, 3],
    [enemyData.dragonBat, 2],
    [enemyData.efreeti, 2],
    [enemyData.vampireBat, 5],
  ]),
  startingLives: 3,
}
