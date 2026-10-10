/**
 * Web Audio API Engine for TrailWhisper
 * Live Microphone capture, real-time waveform & FFT analysis,
 * Procedural bird call synthesizers, Solfeggio tones, and speech synthesis
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isListening: boolean = false;
  private onAudioActivityCallback: ((rms: number, peakFreq: number) => void) | null = null;
  private analysisFrameId: number | null = null;

  public getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Start microphone capture and hook up AnalyserNode
   */
  async startMicrophone(onActivity?: (rms: number, peakFreq: number) => void): Promise<{ analyser: AnalyserNode; stream: MediaStream }> {
    const ctx = this.getAudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      }
    });

    this.mediaStream = stream;
    this.sourceNode = ctx.createMediaStreamSource(stream);
    
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.75;

    this.sourceNode.connect(this.analyser);
    this.isListening = true;
    this.onAudioActivityCallback = onActivity || null;

    if (this.onAudioActivityCallback) {
      this.startActivityLoop();
    }

    return { analyser: this.analyser, stream };
  }

  private startActivityLoop(): void {
    const check = () => {
      if (!this.isListening || !this.analyser) return;

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      // Compute RMS energy
      let sum = 0;
      let maxVal = 0;
      let maxIdx = 0;
      for (let i = 0; i < bufferLength; i++) {
        const val = dataArray[i];
        sum += val * val;
        if (val > maxVal) {
          maxVal = val;
          maxIdx = i;
        }
      }
      const rms = Math.sqrt(sum / bufferLength) / 255;
      const peakFreq = (maxIdx * (this.ctx?.sampleRate || 44100)) / (bufferLength * 2);

      if (this.onAudioActivityCallback) {
        this.onAudioActivityCallback(rms, peakFreq);
      }

      this.analysisFrameId = requestAnimationFrame(check);
    };

    this.analysisFrameId = requestAnimationFrame(check);
  }

  /**
   * Stop microphone stream
   */
  stopMicrophone(): void {
    if (this.analysisFrameId) {
      cancelAnimationFrame(this.analysisFrameId);
      this.analysisFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.analyser = null;
    this.isListening = false;
    this.onAudioActivityCallback = null;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Procedural Solfeggio 528 Hz Chime
   */
  playSolfeggioChime(frequency: number = 528, duration: number = 2.0): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.06);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 1.5, now);
      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.1, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));

      osc1.connect(masterGain);
      osc2.connect(overtoneGain);
      overtoneGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  /**
   * Procedural Synthesizer for Authentic Bird Calls
   * Allows "Listen to Call" without downloading bulky external MP3 files!
   */
  playSimulatedBirdCall(speciesId: string): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (speciesId === 'asian-koel') {
        // Asian Koel: Ascending two-tone fluty whistle "Koo-ooo-kuek" (1.8 kHz to 2.8 kHz) repeated 3 times
        for (let i = 0; i < 3; i++) {
          const start = now + (i * 0.75);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';

          osc.frequency.setValueAtTime(1800, start);
          osc.frequency.exponentialRampToValueAtTime(2850, start + 0.45);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.25, start + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.55);
        }
      } else if (speciesId === 'coppersmith-barbet') {
        // Coppersmith Barbet: Metronomic metallic taps at 1.1 kHz (Tuk... Tuk... Tuk)
        for (let i = 0; i < 5; i++) {
          const start = now + (i * 0.45);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';

          osc.frequency.setValueAtTime(1120, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.2);
        }
      } else if (speciesId === 'rufous-treepie') {
        // Rufous Treepie: Musical metallic bell notes (2.2 kHz to 1.6 kHz)
        const notes = [2200, 1900, 2400, 1600];
        notes.forEach((freq, idx) => {
          const start = now + (idx * 0.28);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';

          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.22, start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.26);
        });
      } else if (speciesId === 'indian-peafowl') {
        // Peacock: Downward-sweeping bugle call "May-awe" (2.1 kHz down to 850 Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(2100, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.85);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        // Low-pass filter to soften sawtooth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.95);
      } else {
        // Nature rustle / Solfeggio frequency fallback
        this.playSolfeggioChime(528, 1.5);
      }
    } catch (e) {
      console.warn('Bird call synthesis error:', e);
    }
  }

  /**
   * Directional Whisper Speech Synthesis
   */
  whisperSentence(text: string, onEnd?: () => void): void {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    this.playSolfeggioChime(528, 1.5);

    setTimeout(() => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 0.95;
      utterance.volume = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('India')) && 
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    }, 350);
  }
}

export const audioEngine = new AudioEngine();
