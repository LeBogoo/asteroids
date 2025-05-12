import { Packet } from "../packet";

export class YouPacket extends Packet {
  constructor(public id: string) {
    super("you");
  }
}
