import { Packet } from "../packet";

export class DestroyPacket extends Packet {
  constructor(public id: string) {
    super("destroy");
  }
}
