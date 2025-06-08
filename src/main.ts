import "./style.css";
import { Vector } from "./game/vector";
import { SoundManager } from "./game/soundmanger";
import { Game } from "./game/game";
import { DebugPanel } from "./debug-panel";

SoundManager.loadSound("shoot", "shoot.wav");
SoundManager.loadSound("explode_big", "explode_big.wav");
SoundManager.loadSound("explode_small", "explode_small.wav");

const game = new Game({
  seed: 12345,
  renderOptions: { resize: true, zoom: 1 },
});

const debugPanel = new DebugPanel(game.world, game.spaceship);
game.onUpdate = (deltaTime: number) => {
  debugPanel.update(deltaTime);
};

SoundManager.world = game.world;
game.start();

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
    Vector.fromAngle(game.spaceship.rotation + 0, 64),
    Vector.fromAngle(game.spaceship.rotation + 140, 64),
    Vector.fromAngle(game.spaceship.rotation + 180, 32),
    Vector.fromAngle(game.spaceship.rotation + -140, 64),
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

setInterval(updateFavicon, 1000 / 30);
