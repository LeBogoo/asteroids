import { Packet } from "./packet";
import { PingPacket } from "./packets/ping-packet";
import { PongPacket } from "./packets/pong-packet";

export class Connection {
  private ws: WebSocket;
  private subscriptions: Map<string, ((data: Packet) => void)[]> = new Map();

  constructor(url: string) {
    this.ws = new WebSocket(url, ["asteroids"]);

    this.ws.addEventListener("open", () => {
      console.log("Connected to server");
    });
    this.ws.addEventListener("close", () => {
      console.log("Disconnected from server");
    });
    this.ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
    this.ws.addEventListener("message", (event) => {
      try {
        const data = Packet.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    this.on<PingPacket>("ping", (packet) => {
      this.send(new PongPacket(packet.timestamp));
    });
  }

  private handleMessage(data: Packet) {
    console.log("↙️", data);
    const { type } = data;
    const callbacks = this.subscriptions.get(type);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in callback:", error);
        }
      });
    }
  }

  on<T extends Packet>(type: string, callback: (data: T) => void) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }

    const callbacks = this.subscriptions.get(type);
    if (callbacks) {
      callbacks.push(callback as any);
    }
  }

  public get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  send(data: Packet) {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(data));
      console.log("↗️", data);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null!;
    }
  }
}
