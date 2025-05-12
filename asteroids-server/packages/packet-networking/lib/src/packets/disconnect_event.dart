import 'package:packet_networking/packet_networking.dart';

class DisconnectEvent extends IncomingPacket {
  @override
  String type = "disconnect_event";

  @override
  String stringify() {
    return "DisconnectEvent{}";
  }
}
