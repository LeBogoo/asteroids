import { Packet } from "../packet";

export class LeftGamePacket extends Packet {
  constructor(public id: string, public username: string) {
    super("left_game");
  }
}
