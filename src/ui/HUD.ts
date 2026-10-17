import Phaser from 'phaser';

type HUDStats = { health: number; oxygen: number; inventory: Record<string, number> };

export default class HUD {
  scene: Phaser.Scene;
  x: number;
  y: number;
  healthText!: Phaser.GameObjects.Text;
  oxygenText!: Phaser.GameObjects.Text;
  inventoryText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, pos: { x: number; y: number }) {
    this.scene = scene;
    this.x = pos.x;
    this.y = pos.y;
    this.create();
  }

  create() {
    this.healthText = this.scene.add.text(this.x, this.y, 'HP: 100', { font: '14px monospace', color: '#fff' }).setScrollFactor(0);
    this.oxygenText = this.scene.add.text(this.x, this.y + 18, 'OXY: 100', { font: '14px monospace', color: '#fff' }).setScrollFactor(0);
    this.inventoryText = this.scene.add.text(this.x, this.y + 36, 'INV: {}', { font: '14px monospace', color: '#fff' }).setScrollFactor(0);
  }

  updateStats(stats: HUDStats) {
    this.healthText.setText(`HP: ${stats.health}`);
    this.oxygenText.setText(`OXY: ${stats.oxygen}`);
    this.inventoryText.setText(`INV: ${JSON.stringify(stats.inventory)}`);
  }
}
