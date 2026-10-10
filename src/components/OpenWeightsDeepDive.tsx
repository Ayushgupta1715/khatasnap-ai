import { Cpu, Terminal, Shield, Lock, Layers, Code } from 'lucide-react';

export const OpenWeightsDeepDive = () => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-xs font-mono text-[#00C896] mb-4">
          <Cpu className="w-4 h-4" />
          <span>HACKTOBERFEST 2026 ARCHITECTURE & OPEN-WEIGHTS GROUNDING</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F2] tracking-tight mb-4">
          Why Open Innovation Matters on Mountain Trails
        </h2>

        <p className="text-sm sm:text-base text-[#97A89D] leading-relaxed mb-6">
          Proprietary cloud LLMs and closed speech APIs fail the moment you step past the cellular Dead-Zone in a deep forest or mountain gorge. TrailWhisper proves why local, open-weights models are indispensable for human presence in nature.
        </p>

        {/* 4 Pillars of Open Innovation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#070D0A] p-5 rounded-xl border border-[#1B2E23]">
            <div className="flex items-center gap-2 text-[#00C896] font-semibold text-sm mb-2">
              <Lock className="w-4 h-4" />
              <span>1. Zero-Signal Autonomy (True Dead-Zone)</span>
            </div>
            <p className="text-xs text-[#97A89D] leading-relaxed">
              No cloud handshakes, zero latency, no fallback error screens when roaming without LTE/5G. The acoustic model weights execute directly in the browser runtime via WebAssembly &amp; WebGL.
            </p>
          </div>

          <div className="bg-[#070D0A] p-5 rounded-xl border border-[#1B2E23]">
            <div className="flex items-center gap-2 text-[#76D7A5] font-semibold text-sm mb-2">
              <Shield className="w-4 h-4" />
              <span>2. Absolute Wilderness Acoustic Privacy</span>
            </div>
            <p className="text-xs text-[#97A89D] leading-relaxed">
              Your microphone data never leaves your device. Private forest conversations and ambient trail sounds are processed transiently in Web Audio buffers and discarded immediately.
            </p>
          </div>

          <div className="bg-[#070D0A] p-5 rounded-xl border border-[#1B2E23]">
            <div className="flex items-center gap-2 text-[#F2C94C] font-semibold text-sm mb-2">
              <Layers className="w-4 h-4" />
              <span>3. Fine-Tuned Indo-Gangetic Bio-Acoustics</span>
            </div>
            <p className="text-xs text-[#97A89D] leading-relaxed">
              Standard commercial apps bias towards North American species. Open-weights allow wildlife researchers to fine-tune directly on South Asian bird calls (Asian Koel, Coppersmith Barbet) and native flora leaf acoustics.
            </p>
          </div>

          <div className="bg-[#070D0A] p-5 rounded-xl border border-[#1B2E23]">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
              <Code className="w-4 h-4" />
              <span>4. Zero API Cost for Hikers &amp; Rangers</span>
            </div>
            <p className="text-xs text-[#97A89D] leading-relaxed">
              Open-source inference costs $0 per hour. Forest guards, biology students, and amateur birders can hike for 8 hours without hitting rate limits or cloud billing surprises.
            </p>
          </div>
        </div>
      </div>

      {/* Model Spec & Architecture Table */}
      <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-6">
        <h3 className="text-lg font-bold text-[#F4F7F2] mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00C896]" />
          <span>Local Open-Source Inference Stack</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1B2E23] text-[#97A89D]">
                <th className="py-2.5 px-3">Component</th>
                <th className="py-2.5 px-3">Open-Weights / Engine</th>
                <th className="py-2.5 px-3">Footprint</th>
                <th className="py-2.5 px-3">Offline Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2E23]/60 text-[#F4F7F2]">
              <tr>
                <td className="py-3 px-3 font-semibold text-[#00C896]">Bird Acoustic Model</td>
                <td className="py-3 px-3">BirdNET-Mini (FP16 ONNX)</td>
                <td className="py-3 px-3 text-[#97A89D] tabular-nums">8.4 MB</td>
                <td className="py-3 px-3">CacheStorage + Web Worker</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#00C896]">Flora Leaf Acoustic</td>
                <td className="py-3 px-3">MobileNet-V3 BioAcoustic</td>
                <td className="py-3 px-3 text-[#97A89D] tabular-nums">4.2 MB</td>
                <td className="py-3 px-3">IndexedDB weights persistence</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#00C896]">Whisper Chimes</td>
                <td className="py-3 px-3">Native Web Audio Oscillators (528 Hz)</td>
                <td className="py-3 px-3 text-[#97A89D] tabular-nums">0 KB</td>
                <td className="py-3 px-3">100% procedural synthesis</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#00C896]">Ear-First Voice</td>
                <td className="py-3 px-3">SpeechSynthesis API (Device Native)</td>
                <td className="py-3 px-3 text-[#97A89D] tabular-nums">0 KB</td>
                <td className="py-3 px-3">On-device TTS engine</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
