import { describe, expect, it } from 'vitest';
import { generateIsland } from '../src/world/generator';

describe('world generator', () => {
  it('is deterministic for a seed', () => {
    const a = generateIsland(40, 20, 12345);
    const b = generateIsland(40, 20, 12345);
    expect(a).toEqual(b);
  });

  it('creates some land and water', () => {
    const tiles = generateIsland(60, 30, 77);
    let water = 0;
    let land = 0;
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        if (tiles[y][x] === 0) water++;
        else land++;
      }
    }
    expect(water).toBeGreaterThan(0);
    expect(land).toBeGreaterThan(0);
  });
});
