import 'package:packet_networking/packet_networking.dart';

class LeftGamePacket extends OutgoingPacket {
  @override
  String type = "left_game";

  String username = "";
  String id = "";

  LeftGamePacket({
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
    return "LeftGamePacket{username: $username, id: $id}";
  }
}
