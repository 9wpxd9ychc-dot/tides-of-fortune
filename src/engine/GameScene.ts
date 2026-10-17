import Phaser from 'phaser';
import { generateIsland, TileType } from '../world/generator';
import HUD from '../ui/HUD';
import Inventory from '../ui/Inventory';

const TILE_SIZE = 24;
const MAP_W = 80;
const MAP_H = 40;

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

    this.tiles = generateIsland(MAP_W, MAP_H, this.seed);

    this.groundLayer = this.add.graphics();
    this.groundGroup = this.physics.add.staticGroup();

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tileType = this.tiles[y][x];
        const worldX = x * TILE_SIZE;
        const worldY = y * TILE_SIZE;

        if (tileType === TileType.Water) {
          this.groundLayer.fillStyle(0x3498db, 1);
          this.groundLayer.fillRect(worldX, worldY, TILE_SIZE, TILE_SIZE);
          continue;
        }

        const color = tileType === TileType.Sand ? 0xf4a460 : 0x2ecc71;
        this.groundLayer.fillStyle(color, 1);
        this.groundLayer.fillRect(worldX, worldY, TILE_SIZE, TILE_SIZE);

        const rect = this.add.rectangle(
          worldX + TILE_SIZE / 2,
          worldY + TILE_SIZE / 2,
          TILE_SIZE,
          TILE_SIZE,
        );
        this.physics.add.existing(rect, true);
        this.groundGroup.add(rect);
      }
    }

    const spawn = this.findSpawnPoint();
    this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.setDepth(10);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);

    this.physics.add.collider(this.player, this.groundGroup);

    this.hud = new HUD(this, { x: 10, y: 10 });
    this.hud.updateStats({ health: 100, oxygen: this.oxygen, inventory: this.inventory });

    this.inventoryUI = new Inventory(this, { x: 10, y: 10 });
    this.spawnResources(12);
  }

  update(_time: number, delta: number) {
    const speed = 160;
    const swimSpeed = 100;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    const onWater = this.isInWater(this.player.x, this.player.y + this.player.height / 2);

    if (onWater) {
      playerBody.setGravityY(0);

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

      this.oxygen -= delta * 0.01;
      if (this.oxygen < 0) this.oxygen = 0;
    } else {
      playerBody.setGravityY(800);

      if (this.cursors.left?.isDown) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right?.isDown) {
        this.player.setVelocityX(speed);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursors.up?.isDown && playerBody.blocked.down) {
        this.player.setVelocityY(-420);
      }

      this.oxygen += delta * 0.02;
      if (this.oxygen > 100) this.oxygen = 100;
    }

    this.hud.updateStats({ health: 100, oxygen: Math.round(this.oxygen), inventory: this.inventory });

    if (Phaser.Input.Keyboard.JustDown(this.keyI)) {
      this.inventoryUI.toggle();
    }
  }

  findSpawnPoint() {
    const cx = Math.floor(MAP_W / 2);
    for (let y = 0; y < MAP_H; y++) {
      const tileType = this.tiles[y][cx];
      if (tileType === TileType.Sand || tileType === TileType.Ground) {
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
      const x = Phaser.Math.Between(5, MAP_W - 5);
      const y = Phaser.Math.Between(5, MAP_H - 5);

      if (this.tiles[y][x] !== TileType.Ground) {
        continue;
      }

      const rx = x * TILE_SIZE + TILE_SIZE / 2;
      const ry = y * TILE_SIZE + TILE_SIZE / 2 - 8;
      const g = this.add.graphics();
      g.fillStyle(0x8b4513, 1);
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

  onPickup(_player: Phaser.GameObjects.GameObject, resource: any) {
    const type = resource.resourceType || 'unknown';
    this.inventory[type] = (this.inventory[type] || 0) + 1;
    this.inventoryUI.addItem(type, 1);
    resource.destroy();
  }
}
