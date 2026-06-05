let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playBuzzerSound(type: "start" | "end") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay restrictions)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === "start") {
      // Pleasant rising focus chime (sine wave, rising tone)
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "end") {
      // Classic multi-pulse buzzer alarm (sawtooth + square mix)
      const pulseDuration = 0.22;
      const gap = 0.08;

      for (let i = 0; i < 3; i++) {
        const pulseStart = now + i * (pulseDuration + gap);

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Create detuned rich low waves for authentic buzzer vibe
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(130, pulseStart);

        osc2.type = "square";
        osc2.frequency.setValueAtTime(133, pulseStart);

        gainNode.gain.setValueAtTime(0.15, pulseStart);
        gainNode.gain.linearRampToValueAtTime(0.15, pulseStart + pulseDuration - 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, pulseStart + pulseDuration);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(pulseStart);
        osc1.stop(pulseStart + pulseDuration);
        osc2.start(pulseStart);
        osc2.stop(pulseStart + pulseDuration);
      }
    }
  } catch (err) {
    console.error("Audio playback failed:", err);
  }
}
