export class Random {
  private rng: () => number;

  constructor(seed: number = Date.now()) {
    this.rng = Random.splitmix32(seed);
  }

  next(): number {
    return this.rng();
  }

  private static splitmix32(seed: number) {
    return function () {
      seed |= 0;
      seed = (seed + 0x9e3779b9) | 0;
      let t = seed ^ (seed >>> 16);
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ (t >>> 15);
      t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
    };
  }
}
