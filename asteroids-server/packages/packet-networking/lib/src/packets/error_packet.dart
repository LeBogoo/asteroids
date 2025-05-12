import 'package:packet_networking/packet_networking.dart';

class ErrorPacket extends OutgoingPacket {
  @override
  String type = "error";

  final String error;
  final Map<String, dynamic> data;

  ErrorPacket({
    required this.error,
    this.data = const {},
  });

  @override
  Map<String, dynamic> toJson() {
    return {
      ...super.toJson(),
      "error": error,
      "data": data,
    };
  }

  @override
  String stringify() {
    return "ErrorPacket{error: $error, data: $data}";
  }
}
