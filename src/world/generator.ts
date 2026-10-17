export enum TileType {
  Water = 0,
  Sand = 1,
  Ground = 2,
}

// simple seeded PRNG (mulberry32)
function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateIsland(width: number, height: number, seed = 42): number[][] {
  const rand = mulberry32(seed);
  // create empty grid
  const tiles: number[][] = [];
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = TileType.Water;
    }
  }

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) * 0.4;

  // Create an island shape with jitter
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx + (rand() - 0.5) * 2 * 2; // jitter
      const dy = y - cy + (rand() - 0.5) * 2 * 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const normalized = d / maxR;
      // threshold with noise
      const noise = (rand() * 0.5 + 0.5 * Math.sin((x + y + seed) * 0.1));
      const value = normalized - noise * 0.4;
      if (value < 0.6) {
        // land
        // determine beach vs ground
        if (value > 0.45) tiles[y][x] = TileType.Sand;
        else tiles[y][x] = TileType.Ground;
      } else {
        tiles[y][x] = TileType.Water;
      }
    }
  }

  return tiles;
}
