import type { Updateable } from "./interfaces/updateable";
import { Spaceship } from "./spaceship";
import type { World } from "./world";

export class GUI implements Updateable {
  private world: World;
  private spaceship: Spaceship;

  private guiContainer: SVGSVGElement;

  constructor(guiContainer: SVGSVGElement, world: World) {
    this.world = world;
    this.spaceship = this.world.getObjects().find((obj) => obj instanceof Spaceship && obj.isPlayer) as Spaceship;
    this.guiContainer = guiContainer;

    this.createGui();
  }

  private createGui() {
    // create 20 rectangles next to each other with a bit of space between them
    const healthHeight = 30;
    const singleHealthWidth = 20;
    const healthOffset = 5;
    const skew = 20;
    const outlinePadding = 4;

    const healthContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    healthContainer.setAttribute("id", "health-container");
    healthContainer.setAttribute("transform", `translate(10, ${window.innerHeight - healthHeight - 10})`);

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
  }
}
