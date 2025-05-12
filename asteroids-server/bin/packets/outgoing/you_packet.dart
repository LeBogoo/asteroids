import 'package:packet_networking/packet_networking.dart';

class YouPacket extends OutgoingPacket {
  @override
  String type = "you";

  String id = "";

  YouPacket({
    required this.id,
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      "id": id,
    };
  }

  @override
  String stringify() {
    return "YouPacket{id: $id}";
  }
}
