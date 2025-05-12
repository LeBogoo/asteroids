import { Packet } from "../packet";

export class JoinGamePacket extends Packet {
  constructor(public username: string) {
    super("join_game");
  }
}
