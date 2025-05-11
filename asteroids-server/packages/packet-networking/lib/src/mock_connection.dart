import 'package:packet_networking/packet_networking.dart';

class MockConnection extends Connection {
  @override
  void on<T extends IncomingPacket>(Function(T) callback) {}

  @override
  void send(OutgoingPacket packet) {}

  @override
  void sendRaw(String raw) {}

  @override
  void reset() {}

  @override
  void preserve() {}

  @override
  void close() {}

  @override
  void disconnect() {
    connected = false;
  }
}
