import type { Deltas } from './types';

export type AudioCue =
  | 'decision-positive'
  | 'decision-negative'
  | 'decision-mixed'
  | 'radio'
  | 'alarm'
  | 'dawn'
  | 'failure'
  | 'none';

/** Select a subtle one-shot cue using existing story state. Pure and safe to test without a browser. */
export function classifyDecisionCue(eventId: string, deltas: Deltas, flags: readonly string[]): AudioCue {
  const flagSet = new Set(flags);
  if (flagSet.has('ending-first-morning')) return 'dawn';
  if (flagSet.has('ending-last-light') || flagSet.has('test-pulse-failed')) return 'failure';
  if (/signal|line.?9|jorel|veil|station|handshake|uplink|transmission|radio/i.test(eventId)) return 'radio';
  if (/blackout|breach|security|emergency|hospital|raid|whiteout|crisis|shutdown/i.test(eventId)) return 'alarm';

  const values = Object.values(deltas).filter((value): value is number => typeof value === 'number' && value !== 0);
  const positive = values.some((value) => value > 0);
  const negative = values.some((value) => value < 0);
  if (positive && negative) return 'decision-mixed';
  if (positive) return 'decision-positive';
  if (negative) return 'decision-negative';
  return 'none';
}

/**
 * Lightweight, generated AFTERLIGHT soundscape using the Web Audio API.
 * No downloaded assets, no autoplay: the context is created only after an explicit user action.
 */
export class AfterlightAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambienceBus: GainNode | null = null;
  private ambienceSources: AudioScheduledSourceNode[] = [];
  private ambienceNodes: AudioNode[] = [];
  private volume = 0.45;

  get isInitialised(): boolean {
    return this.context !== null;
  }

  unlock(): void {
    const context = this.ensureContext();
    if (context && context.state === 'suspended') void context.resume().catch(() => undefined);
  }

  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(0.8, value));
    if (!this.context || !this.master) return;
    this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.035);
  }

  setAmbience(enabled: boolean): void {
    if (!enabled) {
      this.stopAmbience();
      return;
    }

    const context = this.ensureContext();
    if (!context) return;
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
    if (!this.ambienceBus) this.startAmbience(context);
  }

  play(cue: AudioCue): void {
    if (cue === 'none') return;
    const context = this.ensureContext();
    if (!context || !this.master) return;
    if (context.state === 'suspended') void context.resume().catch(() => undefined);

    switch (cue) {
      case 'decision-positive':
        this.playNotes([[392, 0, 0.16], [523.25, 0.095, 0.22]], 0.055, 'sine');
        break;
      case 'decision-negative':
        this.playNotes([[293.66, 0, 0.18], [220, 0.115, 0.24]], 0.055, 'triangle');
        break;
      case 'decision-mixed':
        this.playNotes([[349.23, 0, 0.12], [440, 0.09, 0.14]], 0.045, 'sine');
        break;
      case 'radio':
        this.playStatic(0.17);
        this.playNotes([[659.25, 0.12, 0.1], [783.99, 0.25, 0.14], [587.33, 0.44, 0.12]], 0.035, 'sine');
        break;
      case 'alarm':
        this.playNotes([[587.33, 0, 0.12], [783.99, 0.17, 0.12], [587.33, 0.34, 0.16]], 0.06, 'square');
        break;
      case 'dawn':
        this.playNotes([[392, 0, 0.42], [523.25, 0.2, 0.48], [659.25, 0.43, 0.55], [783.99, 0.7, 0.82]], 0.06, 'sine');
        break;
      case 'failure':
        this.playNotes([[329.63, 0, 0.17], [246.94, 0.13, 0.2], [164.81, 0.3, 0.34]], 0.065, 'triangle');
        break;
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.context && this.context.state !== 'closed') return this.context;
    if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return null;

    try {
      this.context = new window.AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
      return this.context;
    } catch {
      this.context = null;
      this.master = null;
      return null;
    }
  }

  private startAmbience(context: AudioContext): void {
    if (!this.master) return;
    const bus = context.createGain();
    bus.gain.setValueAtTime(0.0001, context.currentTime);
    bus.gain.exponentialRampToValueAtTime(0.62, context.currentTime + 0.8);
    bus.connect(this.master);
    this.ambienceBus = bus;
    this.ambienceNodes = [bus];
    this.ambienceSources = [];

    // Filtered noise forms a distant, low-volume wind bed.
    const frames = Math.max(1, Math.floor(context.sampleRate * 2.5));
    const buffer = context.createBuffer(1, frames, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      // A gentle blend of adjacent samples removes some harshness from white noise.
      const current = Math.random() * 2 - 1;
      channel[i] = i === 0 ? current * 0.5 : (current + channel[i - 1] * 0.72) * 0.58;
    }
    const wind = context.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;
    const highPass = context.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 95;
    const lowPass = context.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 620;
    const windGain = context.createGain();
    windGain.gain.value = 0.12;
    wind.connect(highPass).connect(lowPass).connect(windGain).connect(bus);
    wind.start();
    this.ambienceSources.push(wind);
    this.ambienceNodes.push(highPass, lowPass, windGain);

    // Two soft sine oscillators evoke the city's enormous power plant.
    for (const [frequency, level] of [[54, 0.045], [81.5, 0.018]] as const) {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      const gain = context.createGain();
      gain.gain.value = level;
      oscillator.connect(gain).connect(bus);
      oscillator.start();
      this.ambienceSources.push(oscillator);
      this.ambienceNodes.push(gain);
    }
  }

  private stopAmbience(): void {
    const context = this.context;
    const bus = this.ambienceBus;
    const sources = this.ambienceSources;
    const nodes = this.ambienceNodes;
    this.ambienceBus = null;
    this.ambienceSources = [];
    this.ambienceNodes = [];
    if (!context || !bus) return;

    const now = context.currentTime;
    try {
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
      bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      for (const source of sources) source.stop(now + 0.27);
      window.setTimeout(() => {
        sources.forEach((source) => { try { source.disconnect(); } catch { /* already disconnected */ } });
        nodes.forEach((node) => { try { node.disconnect(); } catch { /* already disconnected */ } });
      }, 320);
    } catch {
      sources.forEach((source) => { try { source.stop(); } catch { /* already stopped */ } });
    }
  }

  private playNotes(notes: Array<[frequency: number, offset: number, duration: number]>, peak: number, type: OscillatorType): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    for (const [frequency, offset, duration] of notes) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const start = context.currentTime + offset;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.025, duration / 3));
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(envelope).connect(master);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.025);
      oscillator.onended = () => {
        try { oscillator.disconnect(); envelope.disconnect(); } catch { /* already disconnected */ }
      };
    }
  }

  private playStatic(duration: number): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;
    const frames = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, frames, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / frames);

    const source = context.createBufferSource();
    source.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1250;
    filter.Q.value = 0.65;
    const envelope = context.createGain();
    const now = context.currentTime;
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.028, now + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter).connect(envelope).connect(master);
    source.start(now);
    source.stop(now + duration + 0.01);
    source.onended = () => {
      try { source.disconnect(); filter.disconnect(); envelope.disconnect(); } catch { /* already disconnected */ }
    };
  }
}
