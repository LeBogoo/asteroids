import { Asteroid } from "./game/asteroid";
import type { Updateable } from "./game/interfaces/updateable";
import type { Spaceship } from "./game/spaceship";
import type { World } from "./game/world";

export class DebugPanel implements Updateable {
  private world: World;
  private player: Spaceship;

  private fpsElement!: HTMLSpanElement;
  private playerSpeedElement!: HTMLSpanElement;
  private playerAngleElement!: HTMLSpanElement;
  private asteroidCountElement!: HTMLSpanElement;

  // FPS averaging properties
  private fpsSamples: number[] = [];
  private maxSamples: number = 60;

  constructor(world: World, player: Spaceship) {
    this.world = world;
    this.player = player;

    this.initElements();
  }

  initElements(): void {
    const debugWrapper = document.createElement("div");
    debugWrapper.style.position = "absolute";
    debugWrapper.style.top = "10px";
    debugWrapper.style.left = "10px";
    debugWrapper.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    let [fpsWrapper, fpsElement] = this.createStatistic("FPS");
    this.fpsElement = fpsElement;
    debugWrapper.appendChild(fpsWrapper);

    let [playerSpeedWrapper, playerSpeedElement] = this.createStatistic("Player Speed");
    this.playerSpeedElement = playerSpeedElement;
    debugWrapper.appendChild(playerSpeedWrapper);

    let [playerAngleWrapper, playerAngleElement] = this.createStatistic("Player Angle");
    this.playerAngleElement = playerAngleElement;
    debugWrapper.appendChild(playerAngleWrapper);

    let [asteroidCountWrapper, asteroidCountElement] = this.createStatistic("Asteroid Count");
    this.asteroidCountElement = asteroidCountElement;
    debugWrapper.appendChild(asteroidCountWrapper);

    document.body.appendChild(debugWrapper);
  }

  private createStatistic(name: string): [HTMLDivElement, HTMLSpanElement] {
    const wrapper = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = name + ": ";
    wrapper.appendChild(label);
    const value = document.createElement("span");
    value.style.marginLeft = "5px";
    wrapper.appendChild(value);
    return [wrapper, value];
  }

  update(deltaTime: number): void {
    const currentFps = 1 / deltaTime;

    // Add current FPS sample
    this.fpsSamples.push(currentFps);

    // Keep only the last 60 samples
    if (this.fpsSamples.length > this.maxSamples) {
      this.fpsSamples.shift();
    }

    // Calculate average FPS
    const averageFps =
      this.fpsSamples.length > 0
        ? Math.floor(this.fpsSamples.reduce((sum, fps) => sum + fps, 0) / this.fpsSamples.length)
        : 0;

    const playerSpeed = this.player.velocity;
    const playerAngle = this.player.rotation;
    const asteroidCount = this.world.getObjects().filter((obj) => obj instanceof Asteroid).length;

    this.fpsElement.textContent = averageFps.toString();
    this.playerSpeedElement.textContent = playerSpeed.toFixed(2) + " px/s";
    this.playerAngleElement.textContent = playerAngle.toFixed(2) + "°";
    this.asteroidCountElement.textContent = asteroidCount.toString();
  }
}
