import { Packet } from "../packet";

export class PingPacket extends Packet {
  constructor(public timestamp: number) {
    super("ping");
  }
}
