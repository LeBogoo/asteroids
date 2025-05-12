import type { GameObject } from "./gameobject";
import type { Updateable } from "./interfaces/updateable";

export class World implements Updateable {
  private gameObjects: Map<string, GameObject> = new Map();

  addObject(gameObject: GameObject): void {
    this.gameObjects.set(gameObject.id, gameObject);
    this.onAdd(gameObject);
    gameObject.world = this;

    console.log(this.gameObjects);
  }

  updateObject(gameObject: GameObject): void {
    let object = this.gameObjects.get(gameObject.id);
    if (!object) {
      console.warn(`Object ${gameObject.type} (${gameObject.id}) not found in world`);
      return;
    }

    object.updateWith(gameObject);
  }

  removeObject(gameObject: GameObject): void {
    if (!this.gameObjects.has(gameObject.id)) {
      return;
    }
    this.gameObjects.delete(gameObject.id);
    gameObject.world = null;
    this.onRemove(gameObject);
  }

  onAdd(gameObject: GameObject) {}
  onRemove(gameObject: GameObject) {}

  update(deltaTime: number): void {
    for (const gameObject of this.getObjects()) {
      gameObject.update(deltaTime);
      gameObject.updateElement();
    }
  }

  getObjects(): GameObject[] {
    return [...this.gameObjects.values()];
  }
}
