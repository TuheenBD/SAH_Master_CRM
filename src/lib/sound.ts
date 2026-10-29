/**
 * Master CRM - Executive Audio Engine (Web Audio API Synthesizer)
 * Produces mild, ultra-clean glass haptic tones on hover without any external audio files.
 */

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;
let lastSoundTime = 0;
let lastTarget: EventTarget | null = null;

// Initialize state from localStorage in client
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('master_crm_sound_enabled');
    if (saved !== null) {
      isSoundEnabled = saved === 'true';
    }
  } catch {
    // ignore
  }
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioEnabled(): boolean {
  return isSoundEnabled;
}

export function setAudioEnabled(enabled: boolean): void {
  isSoundEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('master_crm_sound_enabled', String(enabled));
      // Dispatch custom event so Header can update immediately
      window.dispatchEvent(new CustomEvent('sound-toggle-change', { detail: { enabled } }));
    } catch {
      // ignore
    }
  }
}

export function toggleAudioEnabled(): boolean {
  const next = !isSoundEnabled;
  setAudioEnabled(next);
  if (next) {
    // Play a gentle confirmation chime when turned on
    playMildSound('button');
  }
  return next;
}

/**
 * Plays a mild, silky-smooth synthetic glass feedback tone.
 * @param type 'button' for crystal tap, 'card' for velvety ambient resonance
 * @param target optional event target to prevent duplicate sounds when hovering child elements
 */
export function playMildSound(type: 'button' | 'card' = 'button', target?: EventTarget | null): void {
  if (typeof window === 'undefined') return;
  if (!isSoundEnabled) return;

  if (target && target === lastTarget) return;
  lastTarget = target || null;

  const now = performance.now();
  // Prevent audio clutter during fast mouse sweeps (minimum 60ms gap)
  if (now - lastSoundTime < 60) return;
  lastSoundTime = now;

  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'button') {
      // Luxury subtle crystal glass tap (~820Hz to ~540Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, t);
      osc.frequency.exponentialRampToValueAtTime(540, t + 0.032);

      // Very gentle gain: 0.024 peak (mild & pleasant)
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.024, t + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.038);
    } else {
      // Deeper, velvety glass resonance for cards (~480Hz to ~320Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.042);

      // Even softer volume for cards: 0.016 peak
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.016, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.048);
    }
  } catch {
    // Ignore audio errors gracefully
  }
}

export const playClickSound = (type: 'button' | 'card' = 'button') => playMildSound(type);

