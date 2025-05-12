import type { GameObject } from "../../game/gameobject";
import { Packet } from "../packet";

export class SpawnPacket extends Packet {
  constructor(public object: GameObject) {
    super("spawn");
  }
}
