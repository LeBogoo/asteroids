import { GameObject } from "./gameobject";

export abstract class DespawnableGameObject extends GameObject {
  abstract despawnTime: number;

  private get endOfLife(): boolean {
    return this.lifeTime + 3 > this.despawnTime;
  }

  updateElement(): void {
    super.updateElement();
    if (!this.element) return;
    if (this.endOfLife) {
      const deathProgress = (this.lifeTime - this.despawnTime + 3) / 2;
      const blinkMultiplier = 2 + 0.5 * deathProgress;
      const opacity = Math.abs(Math.sin((this.lifeTime * blinkMultiplier * Math.PI) / 1)) > 0.5 ? 1 : 0;
      this.element.setAttribute("opacity", opacity.toString());
    }
  }

  removeIfDead() {
    if (this.lifeTime > this.despawnTime) {
      this.world?.removeObject(this);
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.removeIfDead();
  }
}
