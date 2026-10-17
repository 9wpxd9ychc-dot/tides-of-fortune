import Phaser from 'phaser';

export default class Inventory {
  scene: Phaser.Scene;
  x: number;
  y: number;
  bg!: Phaser.GameObjects.Rectangle;
  itemsText: Phaser.GameObjects.Text[] = [];
  visible = false;
  items: Record<string, number> = {};

  constructor(scene: Phaser.Scene, pos: { x: number; y: number }) {
    this.scene = scene;
    this.x = pos.x;
    this.y = pos.y;
    this.create();
  }

  create() {
    this.bg = this.scene.add
      .rectangle(this.x + 150, this.y + 120, 300, 220, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);

    for (let i = 0; i < 8; i++) {
      const t = this.scene.add
        .text(this.x + 30, this.y + 30 + i * 22, '', {
          font: '16px monospace',
          color: '#fff',
        })
        .setScrollFactor(0)
        .setDepth(101)
        .setVisible(false);
      this.itemsText.push(t);
    }
  }

  toggle() {
    this.visible = !this.visible;
    this.bg.setVisible(this.visible);
    this.itemsText.forEach((t) => t.setVisible(this.visible));
    if (this.visible) this.updateDisplay();
  }

  addItem(type: string, amount = 1) {
    this.items[type] = (this.items[type] || 0) + amount;
    if (this.visible) this.updateDisplay();
  }

  updateDisplay() {
    const lines = Object.entries(this.items).map(([key, value]) => `${key}: ${value}`);
    for (let i = 0; i < this.itemsText.length; i++) {
      this.itemsText[i].setText(lines[i] || '');
    }
  }
}
