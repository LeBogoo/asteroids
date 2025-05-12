import 'package:packet_networking/packet_networking.dart';

class JoinGamePacket extends IncomingPacket {
  @override
  String type = "join_game";

  String username = "";

  JoinGamePacket.empty();

  JoinGamePacket({
    required this.username,
  });

  factory JoinGamePacket.fromJson(Map<String, dynamic> json) {
    return JoinGamePacket(
      username: json["username"],
    );
  }

  @override
  String stringify() {
    return "JoinGamePacket{username: $username}";
  }
}
