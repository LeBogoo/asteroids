export class Packet {
  constructor(public type: string) {}

  stringify(): string {
    return JSON.stringify(this, (key, value) => {
      if (value instanceof Map) {
        return {
          dataType: "Map",
          value: Array.from(value.entries()),
        };
      } else {
        return value;
      }
    });
  }

  static parse<T extends Packet>(eventString: string): T {
    const parsed = JSON.parse(eventString, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
          return new Map(value.value);
        }
      }
      return value;
    });

    const event = new Packet("");
    return Object.assign(event, parsed) as T;
  }
}
