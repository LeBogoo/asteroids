import { Spaceship } from "./spaceship";
import type { Vector } from "./vector";
import type { World } from "./world";
import * as Utils from "./utils";

export class SoundManager {
  private static sounds: Map<string, HTMLAudioElement> = new Map();
  private static audioCtx: AudioContext;
  private static noise: AudioBufferSourceNode;
  private static gainNode: GainNode;
  private static filter: BiquadFilterNode;
  private static fadeStartTime: number = 0;
  private static fadeDuration: number = 0.1;
  private static isPlaying: boolean = false;

  public static world: World | undefined;

  static loadSound(name: string, url: string): void {
    const audio = new Audio(url);
    audio.load();
    this.sounds.set(name, audio);
    audio.addEventListener("canplaythrough", () => {
      console.log(`Sound ${name} (${url}) loaded successfully.`);
    });
  }

  static playSoundAt(name: string, position: Vector): void {
    if (!this.world) {
      console.warn("World is not defined. Cannot play sound at position.");
      return;
    }

    const player = this.world.getObjects().find((obj) => obj instanceof Spaceship && obj.isPlayer);
    if (!player) {
      console.warn("Player spaceship not found in the world.");
      return;
    }

    const distance = position.distanceTo(player.position);
    const volume = Utils.lerp(1, 0, distance / 700);

    this.playSound(name, volume);
  }

  static playSound(name: string, volume: number = 1): void {
    if (volume <= 0) return;

    const audio = this.sounds.get(name);
    if (!audio) {
      console.warn(`Sound ${name} not found.`);
      return;
    }
    // Clone the audio node so the same sound can overlap
    const clone = audio.cloneNode(true) as HTMLAudioElement;
    clone.currentTime = 0;
    clone.volume = volume;
    clone.play();
  }

  static playFilteredNoise() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.audioCtx = new window.AudioContext();

    const bufferSize = this.audioCtx.sampleRate;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.noise = this.audioCtx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;

    this.filter = this.audioCtx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(1500, this.audioCtx.currentTime);

    this.gainNode = this.audioCtx.createGain();

    const now = this.audioCtx.currentTime;
    this.fadeStartTime = now;

    // Start from 0 and fade in to 1
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(0.1, now + this.fadeDuration);

    this.noise.connect(this.filter);
    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.noise.start();
  }

  static stopNoise() {
    if (!this.isPlaying || !this.audioCtx || !this.noise || !this.gainNode) return;
    this.isPlaying = false;

    const now = this.audioCtx.currentTime;

    // Estimate current gain value based on elapsed ramp time
    const elapsed = now - this.fadeStartTime;
    const gainAtNow = Math.min(elapsed / this.fadeDuration, 0.1); // linear fade-in assumption

    // Cancel existing ramp and start new fade-out from estimated gain
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(gainAtNow, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + this.fadeDuration);

    this.noise.stop(now + this.fadeDuration + 0.01);
  }
}
