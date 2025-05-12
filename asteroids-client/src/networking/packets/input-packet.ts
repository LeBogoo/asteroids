import { Packet } from "../packet";

export class InputPacket extends Packet {
  constructor(public x: number, public y: number, public shoot: boolean) {
    super("input");
  }
}
