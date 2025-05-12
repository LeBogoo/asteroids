import { Packet } from "../packet";

export class JoinedGamePacket extends Packet {
  constructor(public id: string, public username: string) {
    super("joined_game");
  }
}
