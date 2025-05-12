import { Spaceship } from "./game/spaceship";
import type { Vector } from "./game/interfaces/vector";
import "./style.css";
import type { GameObject } from "./game/gameobject";
import { World } from "./game/world";
import * as Utils from "./game/utils";
import { Connection } from "./networking/connection";
import type { JoinedGamePacket } from "./networking/packets/joined-game-packet";
import { JoinGamePacket } from "./networking/packets/join-game-packet";
import type { LeftGamePacket } from "./networking/packets/lef-game-packet";
import type { SpawnPacket } from "./networking/packets/spawn-packet";
import type { YouPacket } from "./networking/packets/you-packet";
import { InputPacket } from "./networking/packets/input-packet";
import type { UpdatePacket } from "./networking/packets/update-packet";
import { Asteroid } from "./game/asteroid";
import { Bullet } from "./game/bullet";
import { Fragment } from "./game/fragment";

let offset: Vector = { x: 0, y: 0 };

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

const connection = new Connection("ws://localhost:8080/api/ws");
let id!: string;
let spaceship: Spaceship | null = null;

connection.on<YouPacket>("you", (e) => {
  id = e.id;
});

connection.on<JoinedGamePacket>("joined_game", (e) => {
  console.log("Player " + e.username + " joined the game with ID " + e.id);
});

connection.on<LeftGamePacket>("left_game", (e) => {
  console.log("Player " + e.username + " left the game with ID " + e.id);
});

connection.on<SpawnPacket>("spawn", (e) => {
  switch (e.object.type) {
    case "spaceship":
      const ship = Spaceship.fromObject(e.object);
      if (e.object.id === id) spaceship = ship;

      world.addObject(ship);
      break;

    case "asteroid":
      world.addObject(Asteroid.fromObject(e.object));
      break;

    case "bullet":
      world.addObject(Bullet.fromObject(e.object));
      break;

    case "fragment":
      world.addObject(Fragment.fromObject(e.object));
      break;

    default:
      break;
  }
});

connection.on<UpdatePacket>("update", (e) => {
  world.updateObject(e.object);

  // connection.close();
});

setTimeout(() => {
  connection.send(new JoinGamePacket("LeBogo"));
}, 1000);

let keysPressed: Record<string, boolean> = {};

const inputs = new InputPacket(0, 0, false);

window.addEventListener("keydown", (event) => {
  keysPressed[event.key.toLowerCase()] = true;

  sendInput();
});

window.addEventListener("keyup", (event) => {
  keysPressed[event.key.toLowerCase()] = false;
  sendInput();
});

function sendInput() {
  if (!spaceship) return;

  let changed = false;

  if (keysPressed["w"] && inputs.y != 1) {
    inputs.y = 1;
    changed = true;
  }

  if (!keysPressed["w"] && inputs.y == 1) {
    inputs.y = 0;
    changed = true;
  }

  if (keysPressed["s"] && inputs.y != -1) {
    inputs.y = -1;
    changed = true;
  }

  if (!keysPressed["s"] && inputs.y == -1) {
    inputs.y = 0;
    changed = true;
  }

  if (keysPressed["a"] && inputs.x != -1) {
    inputs.x = -1;
    changed = true;
  }
  if (!keysPressed["a"] && inputs.x == -1) {
    inputs.x = 0;
    changed = true;
  }
  if (keysPressed["d"] && inputs.x != 1) {
    inputs.x = 1;
    changed = true;
  }
  if (!keysPressed["d"] && inputs.x == 1) {
    inputs.x = 0;
    changed = true;
  }
  if (keysPressed["space"] && !inputs.shoot) {
    inputs.shoot = true;
    changed = true;
  }
  if (!keysPressed["space"] && inputs.shoot) {
    inputs.shoot = false;
    changed = true;
  }

  if (changed) {
    connection.send(inputs);
  }
}

const favicon = document.createElement("link");
favicon.rel = "icon";
document.head.appendChild(favicon);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
canvas.width = 128;
canvas.height = 128;

function updateFavicon() {
  if (!spaceship) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const hullPoints = [
    Utils.getVectorFromAngle(spaceship.rotation + 0, 64),
    Utils.getVectorFromAngle(spaceship.rotation + 140, 64),
    Utils.getVectorFromAngle(spaceship.rotation + 180, 32),
    Utils.getVectorFromAngle(spaceship.rotation + -140, 64),
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

  if (spaceship) {
    offset.x = spaceship.position.x - window.innerWidth / 2;
    offset.y = spaceship.position.y - window.innerHeight / 2;
  }
  gameArea.setAttribute("viewBox", `${offset.x} ${offset.y} ${window.innerWidth} ${window.innerHeight}`);

  requestAnimationFrame(update);
}

setInterval(updateFavicon, 1000 / 30);

update();
