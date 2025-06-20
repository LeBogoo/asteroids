import { AsteroidManager } from "./asteroid-manager";
import { PlayerController } from "./controller/player-controller";
import { GameRenderer, type GameRendererOptions } from "./game-renderer";
import type { Controller } from "./interfaces/controller";
import { Random } from "./random";
import { Spaceship } from "./gameobjects/spaceship";
import { Vector } from "./vector";
import { World } from "./world";

export interface GameOptions {
  renderOptions: GameRendererOptions;
  seed: number;
}

export class Game {
  random: Random;
  world: World;
  worldRenderer: GameRenderer;
  spaceship: any;
  controller: Controller;
  asteroidManager: AsteroidManager;
  lastUpdate: DOMHighResTimeStamp = performance.now();

  constructor(gameOptions: GameOptions) {
    this.random = new Random(gameOptions.seed);

    this.world = new World();

    this.spaceship = new Spaceship(this.random, true, Vector.zero(), 0);
    this.worldRenderer = new GameRenderer(this.world, { ...gameOptions.renderOptions, focus: this.spaceship });

    this.world.addObject(this.spaceship);

    this.controller = new PlayerController(this.spaceship);

    this.asteroidManager = new AsteroidManager(this.random, this.world, this.spaceship);
  }

  start() {
    this.update();
  }

  onUpdate(_deltaTime: number) {}

  private update() {
    const now = performance.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    this.controller.update(deltaTime);
    this.world.update(deltaTime);
    this.asteroidManager.update(deltaTime);

    this.onUpdate(deltaTime);

    this.worldRenderer.render();

    requestAnimationFrame(this.update.bind(this));
  }
}
