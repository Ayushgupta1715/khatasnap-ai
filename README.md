# 🌿 TrailWhisper — "Keep Eyes on the Canopy. Phone in the Pocket."

**Submission for Hacktoberfest 2026 Week 1 Challenge: "Touch Grass"**  
Challenge URL: [https://dev.to/challenges/hacktoberfest-week1-2026-10-05](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)

---

## 🏔️ The Problem: The Trailhead Paradox
When modern hikers enter a forest or mountain trail, they carry smartphones to identify flora and fauna. Ironically, this traps them in the **"Screen Trap"**:
- Staring at high-resolution screens while climbing uneven rocks.
- Waiting indefinitely on 4G/5G spinners because mountain valleys are cellular **Dead-Zones**.
- Closed cloud APIs sending intimate ambient forest audio to private corporate servers.

## 💡 The Solution: TrailWhisper
**TrailWhisper** is an offline-first, zero-screen nature trail audio companion built entirely around **open-weights on-device bio-acoustics**. 

Instead of showing alerts or demanding eye contact, it runs in your pocket. Using the native **Web Audio API** and lightweight open-weight models (`BirdNET-Mini ONNX` & `MobileNet-V3 FloraAcoustic`), it processes ambient forest acoustics, plays procedural 528 Hz Solfeggio announcement chimes, and whispers a concise 1-sentence directional cue directly into your headphones (e.g., *"Asian Koel calling at your ten o'clock, high in the mango canopy"*).

---

## 🎯 Key Built Features

1. **Sticky Header (64px, Zero Overlap):**
   - Fixed header (`h-16`) with high z-index.
   - Main content has `pt-24` (96px) clearance ensuring zero overlap.
   - Features real connectivity tracking (`navigator.onLine`), Dead-Zone indicator, and a live screen-time ticker.

2. **Hero Section (Keep Eyes on the Canopy):**
   - Explains the philosophy and equips the hiker with 1-click **"Start Ear-First Walk"** and **"Test Offline Mode"**.

3. **Ear-First View & Real Web Audio Spectrum:**
   - Microphone capture via `navigator.mediaDevices.getUserMedia`.
   - Real-time 256-bin FFT spectrum visualizer rendered via HTML5 canvas and native `AnalyserNode`.
   - Procedural 528 Hz Solfeggio sine wave synthesizer (zero external sound files needed).
   - 1-sentence directional speech synthesis whisper.
   - Honest labeling with `LIVE EDGE` vs `SIMULATED DEMO` confidence scores and latency metrics.

4. **Regional Indo-Gangetic Bio-Acoustic Grounding:**
   - Replaces generic North American presets with native South Asian wildlife:
     * **Asian Koel** (*Eudynamys scolopaceus*) — 94% conf
     * **Coppersmith Barbet** (*Psilopogon haemacephalus*) — 88% conf
     * **Sacred Fig / Peepal Leaf** (*Ficus religiosa*) — 95% conf
     * **Rufous Treepie** (*Dendrocitta vagabunda*) — 82% conf
     * **Indian Peafowl** (*Pavo cristatus*) & **Banyan Tree** (*Ficus benghalensis*)

5. **🌿 Interactive Trail Bingo (Today's Nature Quest):**
   - 3x2 responsive grid for effortless 1-tap logging without photos or typing:
     * 🐦 3 different bird calls
     * 🌳 2 native tree barks (Peepal/Banyan)
     * 🍃 2 distinct leaf drip tips
     * 🦋 1 forest pollinator
     * 🌬️ 30s pure natural silence
     * 🌱 1 unfamiliar wild flora

6. **Anti-Screen Penalty Shield:**
   - Continuous gaze monitor: If a hiker stares at the screen continuously for >30 seconds, a full-screen blur shield activates:
     > *"Put the phone away. Nature is happening in front of you, not behind this glass."*

7. **Silent Journal (Post-Walk Audit):**
   - Zero notifications during the walk.
   - Computes the **Outdoor Presence Ratio** (e.g., 98.1% Grass Touched).
   - Generates SHA-256 cryptographic fingerprints and cardinal direction bearings for every recorded discovery, exportable to JSON.

---

## 🧠 Why Open Innovation Matters Here

1. **True Dead-Zone Autonomy:** Cellular signals die on mountain trails. Open-weights ONNX models execute locally in the browser via WebAssembly & WebGL without pinging a server.
2. **Wilderness Privacy:** Private conversations and family audio stay on the device and are processed transiently in Web Audio buffers.
3. **Regional Bio-Diversity:** Closed APIs prioritize Western fauna; open-weights allow local researchers to fine-tune directly on endangered and native South Asian species.
4. **$0 API Cost:** Trail rangers and students can hike all day with zero token costs.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Audio Engine:** Native Web Audio API (`AudioContext`, `AnalyserNode`, procedural oscillators) + Web Speech API (`SpeechSynthesis`)

---

## 🚀 Running the Project Locally

```bash
# Clone and enter directory
cd "challenge 2"

# Install dependencies (already built & verified)
npm install

# Start development server
npm run dev

# Production build
npm run build
```
