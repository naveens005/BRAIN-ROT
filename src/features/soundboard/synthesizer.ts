import type { SoundEffect } from '../../types';


// Helper to create noise buffer for percussive / metallic effects
function createNoiseBuffer(ctx: AudioContext, duration: number = 0.5): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export const SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'vine_boom',
    name: 'VINE BOOM',
    emoji: '💥',
    shortcut: '1',
    tag: 'Impact',
    color: 'from-red-600 to-amber-600',
    desc: 'Deep 30Hz sub drop with distortion punch',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.5);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      // Add noise transient
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 0.1);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      noise.connect(noiseGain);
      noiseGain.connect(dest);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 1.0);
    },
  },
  {
    id: 'bruh_bass',
    name: 'BRUH BASS',
    emoji: '🗿',
    shortcut: '2',
    tag: 'Meme',
    color: 'from-amber-600 to-yellow-500',
    desc: 'Formant modulated low voice "bruh" drop',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(105, now);
      osc1.frequency.exponentialRampToValueAtTime(62, now + 0.45);
      osc2.frequency.setValueAtTime(108, now);
      osc2.frequency.exponentialRampToValueAtTime(64, now + 0.45);

      // Formant vowel peak
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.4);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    },
  },
  {
    id: 'airhorn_synth',
    name: 'AIRHORN BLIP',
    emoji: '📢',
    shortcut: '3',
    tag: 'Party',
    color: 'from-yellow-400 to-orange-500',
    desc: 'Triad chord stadium airhorn barrage',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const freqs = [466.16, 587.33, 700.0]; // Bb chord
      
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.linearRampToValueAtTime(f * 1.05, now + 0.05);
        osc.frequency.linearRampToValueAtTime(f, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.setValueAtTime(0.28, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.36);
      });
    },
  },
  {
    id: 'metal_pipe',
    name: 'METAL PIPE',
    emoji: '🔩',
    shortcut: '4',
    tag: 'Chaos',
    color: 'from-slate-400 to-zinc-600',
    desc: 'Clattering resonant metallic cluster fall',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const metalPitches = [312, 467, 890, 1240, 1820, 2480];
      metalPitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * (1 + (Math.random() * 0.05 - 0.025)), now);
        
        gain.gain.setValueAtTime(0.3 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4 + idx * 0.08);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 1.0);
      });

      // Metallic noise crunch
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 0.4);
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.setValueAtTime(3200, now);
      band.Q.setValueAtTime(5, now);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.4, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(band);
      band.connect(nGain);
      nGain.connect(dest);
      noise.start(now);
    },
  },
  {
    id: 'rizz_chord',
    name: 'RIZZ CHORD',
    emoji: '🎷',
    shortcut: '5',
    tag: 'Flirt',
    color: 'from-purple-500 to-pink-500',
    desc: 'Ultra smooth neo-soul maj9 shimmer chord',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      // F#maj9 chord: F#3, C#4, F4, G#4, C#5
      const chord = [185.0, 277.18, 349.23, 415.3, 554.37];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);

        gain.gain.setValueAtTime(0, now + i * 0.03);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.03 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(now + i * 0.03);
        osc.stop(now + 1.4);
      });
    },
  },
  {
    id: 'lazer_pew',
    name: 'LAZER PEW',
    emoji: '🔫',
    shortcut: '6',
    tag: 'SciFi',
    color: 'from-cyan-400 to-blue-600',
    desc: 'High speed descending sci-fi blaster',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.25);
    },
  },
  {
    id: 'goofy_slip',
    name: 'CARTOON SLIP',
    emoji: '🍌',
    shortcut: '7',
    tag: 'Slapstick',
    color: 'from-amber-400 to-lime-400',
    desc: 'Whistling glissando slide up and down',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.45);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.55);
    },
  },
  {
    id: 'sub_drop',
    name: 'SUB DROP 808',
    emoji: '🎛️',
    shortcut: '8',
    tag: 'Bass',
    color: 'from-emerald-500 to-teal-700',
    desc: 'Room-shaking 50Hz sub bass shockwave',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.5);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.9);
    },
  },
  {
    id: 'error_buzz',
    name: 'SKULL ERROR',
    emoji: '☠️',
    shortcut: 'Q',
    tag: 'Fail',
    color: 'from-rose-600 to-red-800',
    desc: 'Obnoxious dissonant buzzer alert',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(140, now);
      osc2.frequency.setValueAtTime(147, now); // Dissonant half step

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.setValueAtTime(0.4, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.36);
    },
  },
  {
    id: 'dialup_glitch',
    name: 'DIALUP GLITCH',
    emoji: '💾',
    shortcut: 'W',
    tag: 'Retro',
    color: 'from-fuchsia-500 to-indigo-600',
    desc: 'Chaotic 90s modem handshake chirps',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
        const startPitch = 800 + i * 400 + (Math.random() * 200);
        osc.frequency.setValueAtTime(startPitch, now + i * 0.05);
        osc.frequency.linearRampToValueAtTime(startPitch * 1.5, now + i * 0.05 + 0.04);

        gain.gain.setValueAtTime(0.18, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.06);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.07);
      }
    },
  },
  {
    id: 'bonk_pop',
    name: 'WOODEN BONK',
    emoji: '🔨',
    shortcut: 'E',
    tag: 'Slapstick',
    color: 'from-amber-500 to-orange-700',
    desc: 'Cheeky hollow mallet bonk sound',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.18);
    },
  },
  {
    id: 'alien_warp',
    name: 'SIGMA WARP',
    emoji: '👽',
    shortcut: 'R',
    tag: 'SciFi',
    color: 'from-teal-400 to-emerald-600',
    desc: 'LFO modulated interdimensional teleporter',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const mainGain = ctx.createGain();

      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(18, now);
      modGain.gain.setValueAtTime(150, now);

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(440, now);
      carrier.frequency.exponentialRampToValueAtTime(880, now + 0.4);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      mainGain.gain.setValueAtTime(0.5, now);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      carrier.connect(mainGain);
      mainGain.connect(dest);

      modulator.start(now);
      carrier.start(now);
      modulator.stop(now + 0.5);
      carrier.stop(now + 0.5);
    },
  },
  {
    id: 'sad_wah',
    name: 'SAD WAH-WAH',
    emoji: '🎺',
    shortcut: 'T',
    tag: 'L-Take',
    color: 'from-blue-600 to-indigo-900',
    desc: 'Sad trumpet failure slide descending',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const notes = [311.13, 293.66, 277.18, 261.63]; // Eb4 -> C4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now + idx * 0.16);
        filter.Q.setValueAtTime(6, now + idx * 0.16);

        gain.gain.setValueAtTime(0, now + idx * 0.16);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.16 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.16 + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.2);
      });
    },
  },
  {
    id: 'skibidi_beat',
    name: 'SKIBIDI BOP',
    emoji: '🚽',
    shortcut: 'Y',
    tag: 'Rot',
    color: 'from-pink-500 to-rose-600',
    desc: 'Staccato micro-beat drum bounce',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      const beatTimes = [0, 0.08, 0.16, 0.24, 0.32];
      beatTimes.forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const f = i === 4 ? 300 : 180 + (i % 2) * 60;
        osc.frequency.setValueAtTime(f, now + t);
        osc.frequency.exponentialRampToValueAtTime(40, now + t + 0.05);

        gain.gain.setValueAtTime(0.6, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.06);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + t);
        osc.stop(now + t + 0.07);
      });
    },
  },
  {
    id: 'mewing_hush',
    name: 'MEWING HUSH',
    emoji: '🤫',
    shortcut: 'U',
    tag: 'Looksmax',
    color: 'from-purple-600 to-indigo-800',
    desc: 'Silence whoosh + deep meditative bell',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      // Bell harmonics
      [523.25, 1046.5, 1567.98].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.2 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 1.3);
      });

      // Air hush
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 0.3);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      noise.start(now);
    },
  },
  {
    id: 'critical_win',
    name: 'CRITICAL WIN',
    emoji: '🏆',
    shortcut: 'I',
    tag: 'Hype',
    color: 'from-yellow-400 to-emerald-400',
    desc: 'Fast 8-bit victory arpeggio',
    play: (ctx, dest) => {
      const now = ctx.currentTime;
      // Fast arpeggio: C5, E5, G5, C6, E6
      const arps = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      arps.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);

        gain.gain.setValueAtTime(0.16, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.12);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.14);
      });
    },
  },
];
