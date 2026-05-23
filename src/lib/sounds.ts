// Web Audio API sound synthesizer — no external files required
// All sounds are generated programmatically so they work offline.

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  // Resume if browser suspended it (autoplay policy)
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
  fadeOut = true,
) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const vol = ac.createGain()
  osc.connect(vol)
  vol.connect(ac.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + startTime)
  vol.gain.setValueAtTime(gain, ac.currentTime + startTime)
  if (fadeOut) vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startTime + duration)
  osc.start(ac.currentTime + startTime)
  osc.stop(ac.currentTime + startTime + duration)
}

const sounds = {
  // Short tick for countdown 3 and 2
  countdownTick() {
    tone(660, 0, 0.12, 0.4, 'sine')
  },

  // Louder, higher tick for the final "1"
  countdownFinal() {
    tone(1320, 0,    0.08, 0.5, 'sine')
    tone(1320, 0.1,  0.15, 0.5, 'sine')
  },

  // Punchy "GO!" chord when the challenge appears
  challengeStart() {
    tone(523, 0,    0.18, 0.35, 'triangle') // C5
    tone(659, 0,    0.18, 0.3,  'triangle') // E5
    tone(784, 0,    0.25, 0.35, 'triangle') // G5
    tone(784, 0.25, 0.25, 0.25, 'triangle') // sustain G5
  },

  // Ascending fanfare when winner is selected
  winner() {
    tone(523, 0,    0.12, 0.4, 'triangle') // C5
    tone(659, 0.12, 0.12, 0.4, 'triangle') // E5
    tone(784, 0.24, 0.12, 0.4, 'triangle') // G5
    tone(1047,0.36, 0.35, 0.5, 'triangle') // C6
    // Extra sparkle
    tone(1047,0.5,  0.15, 0.3, 'sine')
    tone(1319,0.6,  0.2,  0.3, 'sine')
  },

  // Soft downward tone for skip/next
  skip() {
    tone(440, 0,    0.08, 0.25, 'sine')
    tone(330, 0.08, 0.12, 0.2,  'sine')
  },

  // Short pop when game ends (finished screen)
  gameOver() {
    tone(784, 0,    0.1,  0.4, 'triangle')
    tone(659, 0.1,  0.1,  0.4, 'triangle')
    tone(523, 0.2,  0.15, 0.4, 'triangle')
    tone(392, 0.35, 0.3,  0.4, 'triangle')
  },
}

export default sounds
