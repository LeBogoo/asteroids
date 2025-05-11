import 'package:packet_networking/packet_networking.dart';

abstract class Connection {
  static int _nextId = 0;
  int id = _nextId++;
  bool connected = true;

  void send(OutgoingPacket packet);

  void sendRaw(String raw);

  void on<T extends IncomingPacket>(Function(T) callback);

  void reset();

  void preserve();

  void close();

  void disconnect() {
    connected = false;
  }

  Map<String, dynamic> toJson() {
    return {
      "connected": connected,
    };
  }
}
