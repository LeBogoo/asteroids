import { Spaceship } from "./game/spaceship";
import { Vector } from "./game/vector";
import "./style.css";
import type { GameObject } from "./game/gameobject";
import { Asteroid } from "./game/asteroid";
import { World } from "./game/world";
import { SoundManager } from "./game/soundmanger";

let offset: Vector = Vector.zero();

let gameObjects: GameObject[] = [];

const gameArea = document.createElementNS("http://www.w3.org/2000/svg", "svg");
gameArea.setAttribute("style", "border: 1px solid white; display: block;");
document.body.appendChild(gameArea);

const worldBorder = document.createElementNS("http://www.w3.org/2000/svg", "circle");
worldBorder.setAttribute("cx", "0");
worldBorder.setAttribute("cy", "0");
worldBorder.setAttribute("r", "5000");
worldBorder.setAttribute("fill", "none");
worldBorder.setAttribute("stroke", "red");
worldBorder.setAttribute("stroke-width", "2");
gameArea.appendChild(worldBorder);

SoundManager.loadSound("shoot", "shoot.wav");
SoundManager.loadSound("explode_big", "explode_big.wav");
SoundManager.loadSound("explode_small", "explode_small.wav");

function resizeGameArea() {
  gameArea.setAttribute("width", `${window.innerWidth}`);
  gameArea.setAttribute("height", `${window.innerHeight}`);
}

window.addEventListener("resize", resizeGameArea);
resizeGameArea();

const world = new World();
world.onAdd = (gameObject: GameObject) => {
  gameArea.appendChild(gameObject.getElement());
};

world.onRemove = (gameObject: GameObject) => {
  gameArea.removeChild(gameObject.getElement());
};

let spaceship: Spaceship = new Spaceship(Vector.zero(), 0);
world.addObject(spaceship);

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;

  const key = event.key.toLowerCase();

  if (key == " ") spaceship.shoot();
  if (key == "w") spaceship.targetVelocity = 300;
  if (key == "s") spaceship.targetVelocity = -300;
  if (key == "a") spaceship.targetAngularVelocity = -200;
  if (key == "d") spaceship.targetAngularVelocity = 200;
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (key == "w") spaceship.targetVelocity = 0;
  if (key == "s") spaceship.targetVelocity = 0;
  if (key == "a") spaceship.targetAngularVelocity = 0;
  if (key == "d") spaceship.targetAngularVelocity = 0;
});

gameObjects.push(spaceship);

for (let i = 0; i < 100; i++) {
  const radius = Math.random() * 20 + 10;
  const angle = Math.random() * 360;
  const distance = Math.random() * (5000 - radius) + radius;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const asteroid = new Asteroid(new Vector(x, y), angle, radius);
  world.addObject(asteroid);
}

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

  world.update(deltaTime);

  offset.x = spaceship.position.x - window.innerWidth / 2;
  offset.y = spaceship.position.y - window.innerHeight / 2;
  gameArea.setAttribute("viewBox", `${offset.x} ${offset.y} ${window.innerWidth} ${window.innerHeight}`);

  requestAnimationFrame(update);
}

setInterval(updateFavicon, 1000 / 30);

update();
