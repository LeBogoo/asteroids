class PacketNotFoundException implements Exception {
  final String packet;

  PacketNotFoundException(this.packet);

  @override
  String toString() {
    return "PacketNotFoundException: Packet $packet not found";
  }
}
