abstract class OutgoingPacket {
  abstract String type;

  Map<String, dynamic> toJson() {
    return {
      "type": type,
    };
  }

  String stringify();
}
