import Phaser from 'phaser';
import { generateIsland, TileType } from '../world/generator';
import HUD from '../ui/HUD';
import Inventory from '../ui/Inventory';

const TILE_SIZE = 24;
const MAP_W = 80; // tiles
const MAP_H = 40; // tiles

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  groundLayer!: Phaser.GameObjects.Graphics;
  groundGroup!: Phaser.Physics.Arcade.StaticGroup;
  tiles: number[][] = [];
  hud!: HUD;
  oxygen = 100;
  inventory: Record<string, number> = {};
  seed = 42;
  inventoryUI!: Inventory;
  keyI!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // create a simple player texture
    const g = this.add.graphics();
    g.fillStyle(0xff0000, 1);
    g.fillRect(0, 0, 16, 24);
    g.generateTexture('player', 16, 24);
    g.destroy();
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

    // Generate world
    this.tiles = generateIsland(MAP_W, MAP_H, this.seed);

    // Draw ground and create static bodies
    this.groundLayer = this.add.graphics();
    this.groundGroup = this.physics.add.staticGroup();

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const t = this.tiles[y][x];
        const worldX = x * TILE_SIZE;
        const worldY = y * TILE_SIZE;
        if (t === TileType.Water) {
          // draw water
          this.groundLayer.fillStyle(0x3498db, 1);
          this.groundLayer.fillRect(worldX, worldY, TILE_SIZE, TILE_SIZE);
        } else if (t === TileType.Sand) {
          this.groundLayer.fillStyle(0xF4A460, 1);
          this.groundLayer.fillRect(worldX, worldY, TILE_SIZE, TILE_SIZE);
          // create static body for sand
          const rect = this.add.rectangle(worldX + TILE_SIZE / 2, worldY + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
          this.groundGroup.add(rect);
        } else if (t === TileType.Ground) {
          this.groundLayer.fillStyle(0x2ecc71, 1);
          this.groundLayer.fillRect(worldX, worldY, TILE_SIZE, TILE_SIZE);
          const rect = this.add.rectangle(worldX + TILE_SIZE / 2, worldY + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
          this.groundGroup.add(rect);
        }
      }
    }

    // Create player at top-center of the island
    const spawn = this.findSpawnPoint();
    this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.setDepth(10);

    // Allow camera to follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);

    // Collisions
    this.physics.add.collider(this.player, this.groundGroup);

    // HUD
    this.hud = new HUD(this, { x: 10, y: 10 });
    this.hud.updateStats({ health: 100, oxygen: this.oxygen, inventory: this.inventory });

    // Inventory UI
    this.inventoryUI = new Inventory(this, { x: 10, y: 10 });

    // Spawn a few resource nodes (simple)
    this.spawnResources(12);

    // Overlap for pickups will be added when creating resources
  }

  update(time: number, delta: number) {
    const speed = 160;
    const swimSpeed = 100;

    const onWater = this.isInWater(this.player.x, this.player.y + this.player.height / 2);
    if (onWater) {
      // swimming controls
      (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(0);
      if (this.cursors.up?.isDown) {
        this.player.setVelocityY(-swimSpeed);
      }
      if (this.cursors.down?.isDown) {
        this.player.setVelocityY(swimSpeed);
      }
      if (this.cursors.left?.isDown) {
        this.player.setVelocityX(-swimSpeed);
      } else if (this.cursors.right?.isDown) {
        this.player.setVelocityX(swimSpeed);
      } else {
        this.player.setVelocityX(0);
      }

      // oxygen consumption
      this.oxygen -= delta * 0.01; // per ms = about 1% per second
      if (this.oxygen < 0) this.oxygen = 0;

    } else {
      (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(800);
      if (this.cursors.left?.isDown) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right?.isDown) {
        this.player.setVelocityX(speed);
      } else {
        this.player.setVelocityX(0);
      }
      if (this.cursors.up?.isDown && (this.player.body as Phaser.Physics.Arcade.Body).blocked.down) {
        this.player.setVelocityY(-420);
      }
      // recover oxygen slowly
      this.oxygen += delta * 0.02; // regain 2% per second
      if (this.oxygen > 100) this.oxygen = 100;
    }

    this.hud.updateStats({ health: 100, oxygen: Math.round(this.oxygen), inventory: this.inventory });

    // toggle inventory
    if (Phaser.Input.Keyboard.JustDown(this.keyI)) {
      this.inventoryUI.toggle();
    }
  }

  findSpawnPoint() {
    // find highest sand/ground tile near center
    const cx = Math.floor(MAP_W / 2);
    for (let y = 0; y < MAP_H; y++) {
      const t = this.tiles[y][cx];
      if (t === TileType.Sand || t === TileType.Ground) {
        return { x: cx * TILE_SIZE + TILE_SIZE / 2, y: y * TILE_SIZE - TILE_SIZE * 2 };
      }
    }
    return { x: 100, y: 100 };
  }

  isInWater(worldX: number, worldY: number) {
    const tx = Math.floor(worldX / TILE_SIZE);
    const ty = Math.floor(worldY / TILE_SIZE);
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return false;
    return this.tiles[ty][tx] === TileType.Water;
  }

  spawnResources(count: number) {
    for (let i = 0; i < count; i++) {
      // find random ground tile
      const x = Phaser.Math.Between(5, MAP_W - 5);
      const y = Phaser.Math.Between(5, MAP_H - 5);
      if (this.tiles[y][x] === TileType.Ground) {
        const rx = x * TILE_SIZE + TILE_SIZE / 2;
        const ry = y * TILE_SIZE + TILE_SIZE / 2 - 8;
        const g = this.add.graphics();
        g.fillStyle(0x8B4513, 1);
        g.fillCircle(6, 6, 6);
        g.generateTexture(`res_${i}`, 12, 12);
        g.destroy();
        const sprite = this.physics.add.sprite(rx, ry, `res_${i}`);
        sprite.setImmovable(true);
        (sprite as any).isResource = true;
        (sprite as any).resourceType = 'wood';
        this.physics.add.overlap(this.player, sprite, this.onPickup as any, undefined, this);
      }
    }
  }

  onPickup(player: any, resource: any) {
    const type = resource.resourceType || 'unknown';
    this.inventory[type] = (this.inventory[type] || 0) + 1;
    this.inventoryUI.addItem(type, 1);
    resource.destroy();
  }
}
