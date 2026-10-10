import bgMusicUrl from './assets/music.mp3';

// ─── WebAudio Synth Melody Engine (Used during Dark Room intro) ───────────────
const NOTE_SEQ: [number, number][] = [
  [0, 0.75], [0, 0.25], [2, 1], [0, 1], [5, 1], [4, 2],
  [0, 0.75], [0, 0.25], [2, 1], [0, 1], [7, 1], [5, 2],
  [0, 0.75], [0, 0.25], [12, 1], [9, 1], [5, 1], [4, 1], [2, 1],
  [10, 0.75], [10, 0.25], [9, 1], [5, 1], [7, 1], [5, 2],
];

let synthCtx: AudioContext | null = null;
let synthTimer: ReturnType<typeof setTimeout> | null = null;

function playSynthLoop(): void {
  if (!synthCtx || synthCtx.state === 'closed') return;
  let t = synthCtx.currentTime + 0.05;
  const b = 0.42; // beat duration in seconds

  for (const [semitones, beats] of NOTE_SEQ) {
    const osc  = synthCtx.createOscillator();
    const gain = synthCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 261.63 * 2 ** (semitones / 12);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + beats * b * 0.95);
    osc.connect(gain).connect(synthCtx.destination);
    osc.start(t);
    osc.stop(t + beats * b);
    t += beats * b;
  }
  synthTimer = setTimeout(playSynthLoop, (t - synthCtx.currentTime + 1.2) * 1000);
}

/** Starts the intro synth melody in the Dark Room. Resumes or starts on user gesture if blocked. */
export function startIntroMusic(): void {
  if (synthCtx && synthCtx.state !== 'closed') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    synthCtx = new AudioContextClass();

    if (synthCtx.state === 'suspended') {
      const resumeOnGesture = () => {
        if (synthCtx && synthCtx.state === 'suspended') {
          synthCtx.resume().then(() => {
            playSynthLoop();
          }).catch(() => {});
        }
        window.removeEventListener('pointerdown', resumeOnGesture);
        window.removeEventListener('keydown', resumeOnGesture);
      };
      window.addEventListener('pointerdown', resumeOnGesture, { once: true });
      window.addEventListener('keydown', resumeOnGesture, { once: true });
    } else {
      playSynthLoop();
    }
  } catch (err) {
    console.warn('Could not start intro synth:', err);
  }
}

/** Stops the intro synth melody completely when lights turn on. */
export function stopIntroMusic(): void {
  if (synthTimer) {
    clearTimeout(synthTimer);
    synthTimer = null;
  }
  if (synthCtx) {
    try {
      synthCtx.close();
    } catch {}
    synthCtx = null;
  }
}

// ─── Main MP3 Audio Engine (music.mp3 in infinite loop) ───────────────────────
let mp3Audio: HTMLAudioElement | null = null;

/** Plays src/assets/music.mp3 in an infinite loop */
export function playBgMusicMp3(): void {
  if (!mp3Audio) {
    mp3Audio = new Audio(bgMusicUrl);
    mp3Audio.loop = true;
    mp3Audio.volume = 0.8;
  }
  mp3Audio.play().catch((err) => {
    console.warn('MP3 play interrupted or blocked:', err);
    // If blocked, start on next click
    const retry = () => {
      mp3Audio?.play().catch(() => {});
      window.removeEventListener('pointerdown', retry);
    };
    window.addEventListener('pointerdown', retry, { once: true });
  });
}

/** Stops the MP3 background music */
export function stopBgMusicMp3(): void {
  if (mp3Audio) {
    mp3Audio.pause();
    mp3Audio.currentTime = 0;
  }
}

/** Legacy toggle helper if needed */
export function toggleMusic(): boolean {
  playBgMusicMp3();
  return true;
}
