import { X, Volume2, Music, Navigation, Compass, ShieldCheck } from 'lucide-react';
import { Species } from '../types/trail';
import { audioEngine } from '../utils/audio';

interface SpeciesDetailModalProps {
  species: Species | null;
  onClose: () => void;
  onSaveSighting: (species: Species) => void;
  isSaved: boolean;
}

export const SpeciesDetailModal = ({
  species,
  onClose,
  onSaveSighting,
  isSaved
}: SpeciesDetailModalProps) => {
  if (!species) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-[#070D0A]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#0E1712] border border-[#1B2E23] rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 p-2 rounded-full text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#14221B] transition-colors"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Model */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00C896]/15 text-[#00C896] border border-[#00C896]/40">
            {species.badge}
          </span>
          <span className="text-xs font-mono text-[#97A89D]">
            {species.modelArch}
          </span>
        </div>

        {/* Species Names */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F2]">
              {species.commonName}
            </h3>
            {species.hindiName && (
              <span className="text-sm font-medium text-[#00C896]">{species.hindiName}</span>
            )}
          </div>
          <p className="text-sm font-mono italic text-[#97A89D]">{species.scientificName}</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs font-mono">
          <div className="bg-[#070D0A] p-3 rounded-xl border border-[#1B2E23]">
            <span className="text-[#97A89D] block text-[10px] uppercase">Confidence</span>
            <span className="text-base font-bold text-[#00C896] tabular-nums">
              {Math.round(species.confidence * 100)}% Match
            </span>
          </div>
          <div className="bg-[#070D0A] p-3 rounded-xl border border-[#1B2E23]">
            <span className="text-[#97A89D] block text-[10px] uppercase">Latency</span>
            <span className="text-base font-bold text-[#F4F7F2] tabular-nums">
              {species.latencyMs}ms local
            </span>
          </div>
        </div>

        {/* Direction & Habitat */}
        <div className="space-y-3 mb-6 text-xs text-[#97A89D]">
          <div className="flex items-start gap-2 bg-[#070D0A] p-3 rounded-xl border border-[#1B2E23]">
            <Navigation className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F4F7F2] block mb-0.5 font-mono">Direction & Canopy Layer:</strong>
              <span>{species.direction}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-[#070D0A] p-3 rounded-xl border border-[#1B2E23]">
            <Compass className="w-4 h-4 text-[#76D7A5] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F4F7F2] block mb-0.5 font-mono">Natural Habitat:</strong>
              <span>{species.habitat}</span>
            </div>
          </div>
        </div>

        {/* Why this bird? Acoustic Reasoning */}
        {species.whyThisBird && (
          <div className="bg-[#14221B] p-4 rounded-xl border border-[#00C896]/30 mb-6 text-xs">
            <h4 className="font-semibold text-[#00C896] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Acoustic Identification Signature
            </h4>
            <p className="text-[#F4F7F2] leading-relaxed mb-2">{species.whyThisBird}</p>
            {species.seasonalNote && (
              <p className="text-[#97A89D] italic">{species.seasonalNote}</p>
            )}
          </div>
        )}

        {/* Cryptographic SHA-256 fingerprint */}
        <div className="bg-[#070D0A] p-3 rounded-xl border border-[#1B2E23] mb-6 text-[10px] font-mono text-[#97A89D]">
          <span className="text-[#F4F7F2] block font-semibold mb-1">SHA-256 Trail Record Fingerprint:</span>
          <span className="break-all">{species.sha256}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1B2E23]">
          <button
            onClick={() => audioEngine.playSimulatedBirdCall(species.id)}
            className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#182820] text-[#00C896] border border-[#00C896]/40 hover:bg-[#00C896]/15 transition-all"
          >
            <Music className="w-4 h-4" />
            <span>Play Call Audio</span>
          </button>

          <button
            onClick={() => audioEngine.whisperSentence(species.whisperText)}
            className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#00C896] text-[#070D0A] hover:bg-[#76D7A5] transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Whisper</span>
          </button>

          <button
            onClick={() => onSaveSighting(species)}
            className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                : 'bg-[#0E1712] text-[#F4F7F2] border-[#1B2E23] hover:border-[#284434]'
            }`}
          >
            {isSaved ? '✓ Saved in Journal' : 'Save Sighting'}
          </button>
        </div>

      </div>
    </div>
  );
};
