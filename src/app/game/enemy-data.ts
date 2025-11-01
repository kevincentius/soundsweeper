import { soundData } from "./sound/sound";

export const adjDiag = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1], [ 0, 0], [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export interface EnemyData {
  name: string;
  img: string;
  damage: number;
  soundMatrix: string[][][]; // [i, j, sound keys]
}

export function createSimpleEnemy(name: string, img: string, damage: number, soundKeys: string[], adj:number[][]=adjDiag): EnemyData {
  return {
    name,
    img,
    damage: damage,
    soundMatrix: new SoundMatrixBuilder(3).adj(adj, ...soundKeys).build(),
  }
}

export class SoundMatrixBuilder {
  private matrix: string[][][]; // [i, j, sound keys]

  constructor(size: number) {
    this.matrix = new Array(size).fill(0).map(() => new Array(size).fill(0).map(() => []));
  }

  adj(adj: number[][], ...keys: string[]) {
    const center = Math.floor(this.matrix.length / 2);
    adj.forEach(([di, dj]) => this.matrix[center + di][center + dj].push(...keys));
    return this;
  }

  build() { return this.matrix; }
}

const g = soundData.growl.key;
const f = soundData.fire.key;
const w = soundData.wing.key;

export const enemyData = {
  dragon:     createSimpleEnemy('Dragon',      'YoungRedDragon.gif',      3, [g, f, w]),
  demon:      createSimpleEnemy('Demon',       'SanguineAnnihilator.gif', 3, [g, f]),
  couatl:     createSimpleEnemy('Couatl',      'VibrantCoutl.gif',        3, [g, w]),
  bear:       createSimpleEnemy('Bear',        'CaveBear.gif',            3, [g]),
  dragonBat:  createSimpleEnemy('Dragon Bat',  'MoltenDragonBat.gif',     2, [f, w]),
  efreeti:    createSimpleEnemy('Efreeti',     'MoltenEfreeti.gif',       2, [f]),
  vampireBat: createSimpleEnemy('Vampire Bat', 'VampireBat.gif',          1, [w]),
};
