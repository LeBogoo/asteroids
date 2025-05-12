import { Packet } from "../packet";

export class PongPacket extends Packet {
  constructor(public timestamp: number) {
    super("pong");
  }
}
