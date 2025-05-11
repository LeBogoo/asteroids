import 'package:packet_networking/packet_networking.dart';

class DisconnectEvent extends IncomingPacket {
  @override
  String stringify() {
    return "DisconnectEvent{}";
  }
}
