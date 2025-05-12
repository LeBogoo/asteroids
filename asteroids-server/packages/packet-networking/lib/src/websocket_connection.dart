import 'dart:async';
import 'dart:convert';

import 'package:packet_networking/packet_networking.dart';

import 'package:web_socket_channel/web_socket_channel.dart';

class WebsocketConnection extends Connection {
  int _lastRecievedPing = 0;
  bool _cleanedUp = false;

  final WebSocketChannel? webSocket;
  Stream<dynamic> get stream {
    if (webSocket == null) return Stream.empty();
    return webSocket!.stream.asBroadcastStream();
  }

  WebSocketSink get sink {
    if (webSocket == null) throw Exception("WebSocket is null");
    return webSocket!.sink;
  }

  final Map<Type, List<Function>> callbacks = {};
  final Map<Type, List<Function>> preservedCallbacks = {};
  final List<Function()> _disconnectCallbacks = [];

  WebsocketConnection(this.webSocket) {
    if (webSocket == null) return;
    print("[Connection] Initializing new WebSocket connection");

    stream.listen(
      (message) {
        final Map<String, dynamic> jsonMessage;
        try {
          jsonMessage = json.decode(message as String);
        } catch (error) {
          send(ErrorPacket(error: "invalid-json"));

          return;
        }
        try {
          IncomingPacket packet = PacketRegistry.fromJson(jsonMessage);
          print("↙️ ${packet.stringify()}");

          // get type of packet
          Type type = packet.runtimeType;
          if (callbacks.containsKey(type)) {
            for (var callback in callbacks[type]!) {
              callback(packet);
            }
          }
        } catch (error) {
          print("❗ Error: $error");
          send(ErrorPacket(
            error: "internal-server-error",
          ));
        }
      },
      cancelOnError: true,
    );

    stream.handleError((error) {
      print("❗ Error: $error");
      disconnect();
    });

    sink.done.then((value) {
      print("❌ Connection closed");
      disconnect();
    });

    Timer.periodic(Duration(seconds: 30), (timer) {
      send(PingPacket(timestamp: DateTime.now().millisecondsSinceEpoch));

      if (!connected) timer.cancel();

      const int pingTimeout = 5;

      // set another time to wait for the response
      Future.delayed(Duration(seconds: pingTimeout), () {
        if (!connected) return;
        // check if lastrecieved ping is more than 5 seconds
        if (DateTime.now().millisecondsSinceEpoch - _lastRecievedPing >
            (pingTimeout + 1) * 1000) {
          print("❌ Ping timeout");
          webSocket!.sink.close(1000, "Ping timeout");
          timer.cancel();
          disconnect();
        }
      });
    });

    on<PongPacket>((packet) {
      _lastRecievedPing = packet.timestamp;
    });
  }

  @override
  void send(OutgoingPacket packet) {
    if (!connected) return;

    print("↗️ ${packet.stringify()}");

    sink.add(jsonEncode(packet.toJson()));
  }

  @override
  void sendRaw(String raw) {
    if (!connected) return;

    print("[RAW] ↗️ $raw");

    sink.add(raw);
  }

  @override
  void close() {
    if (webSocket != null) {
      try {
        sink.close(1000, "Normal closure");
      } catch (e) {
        print("[Connection] Error during close: $e");
      }
    }
  }

  @override
  void disconnect() {
    if (!connected || _cleanedUp) return;
    print("[Connection] Disconnecting WebSocket");
    _cleanedUp = true;
    connected = false;
    close();
    triggerDisconnectEvent();
  }

  void triggerDisconnectEvent() {
    if (callbacks.containsKey(DisconnectEvent)) {
      for (var callback in callbacks[DisconnectEvent]!) {
        callback(DisconnectEvent());
      }
    }
    for (var callback in _disconnectCallbacks) {
      callback();
    }
  }

  @override
  void on<T extends IncomingPacket>(Function(T) callback) {
    if (!callbacks.containsKey(T)) {
      callbacks[T] = [];
    }
    callbacks[T]!.add(callback);
  }

  void onDisconnect(Function() callback) {
    _disconnectCallbacks.add(callback);
  }

  @override
  void reset() {
    callbacks.clear();
    callbacks.addAll(preservedCallbacks);
  }

  @override
  void preserve() {
    preservedCallbacks.clear();
    preservedCallbacks.addAll(callbacks);
  }
}
