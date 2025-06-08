import type { Updateable } from "./interfaces/updateable";
import { Spaceship } from "./spaceship";
import type { World } from "./world";

export class GUI implements Updateable {
  private world: World;
  private spaceship: Spaceship;

  private guiContainer!: HTMLDivElement;

  constructor(world: World) {
    this.world = world;
    this.spaceship = this.world.getObjects().find((obj) => obj instanceof Spaceship && obj.isPlayer) as Spaceship;

    this.createGui();
  }

  private createGui() {
    this.guiContainer = document.createElement("div");
    this.guiContainer.setAttribute(
      "style",
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"
    );
    document.body.appendChild(this.guiContainer);

    // create 20 rectangles next to each other with a bit of space between them
    const healthHeight = 30;
    const singleHealthWidth = 20;
    const healthOffset = 5;
    const skew = 20;
    const outlinePadding = 4;

    const healthContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    healthContainer.setAttribute("width", `${20 * singleHealthWidth + 19 * healthOffset + skew + 2 * outlinePadding}`);
    healthContainer.setAttribute("height", `${healthHeight + 2 * outlinePadding}`);
    healthContainer.setAttribute("style", "pointer-events: none;");
    healthContainer.setAttribute(
      "viewBox",
      `${-outlinePadding} ${-outlinePadding} ${
        20 * singleHealthWidth + 19 * healthOffset + skew + 4 * outlinePadding
      } ${healthHeight + 2 * outlinePadding}`
    );

    healthContainer.setAttribute("id", "health-container");
    // healthContainer.setAttribute("transform", `translate(10, ${window.innerHeight - healthHeight - 10})`);
    healthContainer.style.position = "absolute";
    healthContainer.style.bottom = "10px";
    healthContainer.style.left = "10px";

    const healthbarOutline = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    healthbarOutline.setAttribute(
      "points",
      `${-outlinePadding},${-outlinePadding}
      ${20 * singleHealthWidth + 19 * healthOffset + outlinePadding},${-outlinePadding}
      ${20 * singleHealthWidth + 19 * healthOffset + skew + 2 * outlinePadding},${healthHeight + outlinePadding}
      ${-outlinePadding},${healthHeight + outlinePadding}`
    );
    healthbarOutline.setAttribute("fill", "none");
    healthbarOutline.setAttribute("stroke", "white");
    healthbarOutline.setAttribute("stroke-width", "2");
    healthContainer.appendChild(healthbarOutline);

    for (let i = 0; i < 20; i++) {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      const x1 = i * (singleHealthWidth + healthOffset);
      const x2 = x1 + singleHealthWidth;
      const bottomLeftSkew = i === 0 ? 0 : skew;
      const points = `${x1},0 ${x2},0 ${x2 + skew},${healthHeight} ${x1 + bottomLeftSkew},${healthHeight}`;
      polygon.setAttribute("points", points);
      polygon.setAttribute("data-health-indicator", "true");

      if (i < 3) polygon.setAttribute("data-color", "rgb(255, 0, 0)");
      else if (i < 10) polygon.setAttribute("data-color", "rgb(238, 154, 0)");
      else polygon.setAttribute("data-color", "rgb(95, 227, 0)");

      healthContainer.appendChild(polygon);
    }

    this.guiContainer.appendChild(healthContainer);

    // Create fragments destroyed counter in top right corner
    const fragmentsCounter = document.createElement("span");
    fragmentsCounter.setAttribute("id", "fragments-counter");
    fragmentsCounter.style.position = "absolute";
    fragmentsCounter.style.top = "10px";
    fragmentsCounter.style.right = "10px";
    fragmentsCounter.style.fontFamily = "monospace";
    fragmentsCounter.style.fontSize = "20px";
    fragmentsCounter.style.color = "white";

    fragmentsCounter.textContent = "Score: 0";
    this.guiContainer.appendChild(fragmentsCounter);

    const versionText = document.createElement("span");
    versionText.setAttribute("id", "version-text");
    versionText.style.position = "absolute";
    versionText.style.bottom = "10px";
    versionText.style.right = "10px";
    versionText.style.fontFamily = "monospace";
    versionText.style.fontSize = "12px";
    versionText.style.color = "white";
    versionText.style.opacity = "0.25";

    versionText.textContent = import.meta.env.VITE_VERSION + "-" + import.meta.env.VITE_HASH;
    this.guiContainer.appendChild(versionText);
  }

  update(_deltaTime: number): void {
    const health = this.spaceship.health;
    const healthContainer = this.guiContainer.querySelector<SVGElement>("#health-container");
    if (!healthContainer) return;
    const polygons = healthContainer.querySelectorAll<SVGPolygonElement>("polygon[data-health-indicator]");
    polygons.forEach((polygon, index) => {
      if (index < health) {
        polygon.setAttribute("fill", polygon.getAttribute("data-color") || "rgb(255, 0, 0)");
      } else {
        polygon.setAttribute("fill", "rgb(33, 33, 33)");
      }
    });

    // Update fragments counter
    const fragmentsCounter = this.guiContainer.querySelector<SVGTextElement>("#fragments-counter");
    if (fragmentsCounter) {
      fragmentsCounter.textContent = `Score: ${this.spaceship.fragmentsDestroyed}`;
    }
  }
}
