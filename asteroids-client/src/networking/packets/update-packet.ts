import type { GameObject } from "../../game/gameobject";
import { Packet } from "../packet";

export class UpdatePacket extends Packet {
  constructor(public object: GameObject) {
    super("update");
  }
}
