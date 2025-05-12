import 'package:packet_networking/packet_networking.dart';

class JoinedGamePacket extends OutgoingPacket {
  @override
  String type = "joined_game";

  String username = "";
  String id = "";

  JoinedGamePacket({
    required this.username,
    required this.id,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      "username": username,
      "id": id,
    };
  }

  @override
  String stringify() {
    return "JoinedGamePacket{username: $username, id: $id}";
  }
}
