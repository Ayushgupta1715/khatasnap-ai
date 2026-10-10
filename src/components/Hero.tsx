import { Volume2, Lock, Radio, Headphones, Compass, EyeOff } from 'lucide-react';

interface HeroProps {
  onStartListening: () => void;
  isListening: boolean;
  onSimulateOffline: () => void;
  isSimulatedOffline: boolean;
}

export const Hero = ({
  onStartListening,
  isListening,
  onSimulateOffline,
  isSimulatedOffline
}: HeroProps) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#0E1712] border border-[#1B2E23] p-6 sm:p-8 mb-8">
      {/* Subtle organic light accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C896]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        {/* Core Headline - Retained exactly as requested */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F7F2] tracking-tight leading-[1.12] mb-2">
          Keep Eyes on the Canopy. <br />
          <span className="text-[#00C896]">Phone in the Pocket.</span>
        </h1>

        {/* Clear Tagline */}
        <p className="text-sm sm:text-base font-semibold text-[#76D7A5] mb-3 tracking-wide">
          Listen. Discover. Stay Present.
        </p>

        {/* Concise Description */}
        <p className="text-xs sm:text-sm text-[#97A89D] leading-relaxed mb-6 font-normal">
          An offline-first trail audio companion that identifies native bird calls and flora on-device, guiding you with 1-sentence whispers when mountain signals disappear.
        </p>

        {/* 4 Crisp Utility Anchors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-7">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070D0A] border border-[#1B2E23]">
            <Lock className="w-4 h-4 text-[#00C896] shrink-0" />
            <span className="text-xs font-medium text-[#F4F7F2]">100% Offline Edge</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070D0A] border border-[#1B2E23]">
            <Volume2 className="w-4 h-4 text-[#76D7A5] shrink-0" />
            <span className="text-xs font-medium text-[#F4F7F2]">1-Sentence Whisper</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070D0A] border border-[#1B2E23]">
            <EyeOff className="w-4 h-4 text-[#F2C94C] shrink-0" />
            <span className="text-xs font-medium text-[#F4F7F2]">Anti-Gaze Shield</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070D0A] border border-[#1B2E23]">
            <Compass className="w-4 h-4 text-[#00C896] shrink-0" />
            <span className="text-xs font-medium text-[#F4F7F2]">Indo-Gangetic Bio</span>
          </div>
        </div>

        {/* Primary and Secondary Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartListening}
            className={`cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              isListening
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-[#00C896] text-[#070D0A] hover:bg-[#76D7A5]'
            }`}
          >
            {isListening ? (
              <>
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Headphones className="w-4 h-4" />
                <span>Start Ear-First Walk</span>
              </>
            )}
          </button>

          <button
            onClick={onSimulateOffline}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-xs border transition-colors ${
              isSimulatedOffline
                ? 'bg-[#F2C94C]/10 text-[#F2C94C] border-[#F2C94C]/40'
                : 'bg-[#070D0A] text-[#97A89D] border-[#1B2E23] hover:text-[#F4F7F2] hover:bg-[#14221B]'
            }`}
          >
            <span>{isSimulatedOffline ? '⚡ Mountain Dead-Zone Active' : 'Toggle Mountain Dead-Zone'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
