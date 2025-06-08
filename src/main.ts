import { Spaceship } from "./game/spaceship";
import { Vector } from "./game/vector";
import "./style.css";
import { World } from "./game/world";
import { SoundManager } from "./game/soundmanger";
import { AsteroidManager } from "./game/asteroid-manager";
import { DebugPanel } from "./debug-panel";
import { PlayerController } from "./game/controller/player-controller";
import { GameRenderer } from "./game/game-renderer";
import { Random } from "./game/random";

SoundManager.loadSound("shoot", "shoot.wav");
SoundManager.loadSound("explode_big", "explode_big.wav");
SoundManager.loadSound("explode_small", "explode_small.wav");

const world = new World();
SoundManager.world = world;

const random = new Random();

const spaceship: Spaceship = new Spaceship(random, true, Vector.zero(), 0);
const worldRenderer = new GameRenderer(world, { focus: spaceship, width: 450, height: 450, zoom: 1 });

world.addObject(spaceship);

const controller = new PlayerController(spaceship);

let debugPanel: DebugPanel | undefined;
if (localStorage.getItem("debug") == "true") debugPanel = new DebugPanel(world, spaceship);

const asteroidManager = new AsteroidManager(random, world, spaceship);

const favicon = document.createElement("link");
favicon.rel = "icon";
document.head.appendChild(favicon);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
canvas.width = 128;
canvas.height = 128;

function updateFavicon() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const hullPoints = [
    Vector.fromAngle(spaceship.rotation + 0, 64),
    Vector.fromAngle(spaceship.rotation + 140, 64),
    Vector.fromAngle(spaceship.rotation + 180, 32),
    Vector.fromAngle(spaceship.rotation + -140, 64),
  ];

  ctx.beginPath();
  ctx.moveTo(hullPoints[0].x + canvas.width / 2, hullPoints[0].y + canvas.height / 2);
  for (let i = 1; i < hullPoints.length; i++) {
    ctx.lineTo(hullPoints[i].x + canvas.width / 2, hullPoints[i].y + canvas.height / 2);
  }

  ctx.closePath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.stroke();

  favicon.href = canvas.toDataURL("image/png");
}

let lastUpdate: number = 0;
function update() {
  const now = performance.now();
  const deltaTime = (now - lastUpdate) / 1000;
  lastUpdate = now;

  controller.update(deltaTime);
  world.update(deltaTime);
  asteroidManager.update(deltaTime);

  debugPanel?.update(deltaTime);

  worldRenderer.render();

  requestAnimationFrame(update);
}

setInterval(updateFavicon, 1000 / 30);

update();
