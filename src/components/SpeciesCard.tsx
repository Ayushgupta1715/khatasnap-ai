import { useState } from 'react';
import { Volume2, Music, Navigation, Info, Check } from 'lucide-react';
import { Species } from '../types/trail';
import { audioEngine } from '../utils/audio';

interface SpeciesCardProps {
  species: Species;
  isRecent?: boolean;
  onSelectDetails: (species: Species) => void;
}

export const SpeciesCard = ({ 
  species, 
  isRecent = false,
  onSelectDetails
}: SpeciesCardProps) => {
  const [isPlayingWhisper, setIsPlayingWhisper] = useState(false);
  const [isPlayingCall, setIsPlayingCall] = useState(false);

  const handlePlayWhisper = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingWhisper(true);
    audioEngine.whisperSentence(species.whisperText, () => {
      setIsPlayingWhisper(false);
    });
  };

  const handlePlayCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingCall(true);
    audioEngine.playSimulatedBirdCall(species.id);
    setTimeout(() => setIsPlayingCall(false), 2400);
  };

  return (
    <div 
      onClick={() => onSelectDetails(species)}
      className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
        isRecent
          ? 'bg-[#14221B] border-[#00C896] shadow-sm'
          : 'bg-[#0E1712] border-[#1B2E23] hover:border-[#284434] hover:bg-[#111d16]'
      }`}
    >
      <div>
        {/* Top bar: Badge + Confidence */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {species.badge === 'LIVE EDGE' ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00C896]/15 text-[#00C896] border border-[#00C896]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
                LIVE EDGE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-[#F2C94C] border border-[#F2C94C]/40">
                SIMULATED DEMO
              </span>
            )}
            <span className="text-[11px] font-mono text-[#97A89D]">
              {species.modelArch.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold text-[#F4F7F2] tabular-nums">
              {Math.round(species.confidence * 100)}%
            </span>
            <span className="text-[10px] text-[#97A89D] uppercase font-mono">conf</span>
          </div>
        </div>

        {/* Species Names with High Readability */}
        <div className="mb-2.5">
          <div className="flex items-baseline gap-2">
            <h4 className="text-base sm:text-lg font-bold text-[#F4F7F2] tracking-tight group-hover:text-[#00C896] transition-colors">
              {species.commonName}
            </h4>
            {species.hindiName && (
              <span className="text-xs text-[#00C896] font-medium">{species.hindiName}</span>
            )}
          </div>
          <p className="text-xs font-mono italic text-[#97A89D]">{species.scientificName}</p>
        </div>

        {/* Spatial Direction Bearing */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-[#070D0A] px-3 py-1.5 rounded-lg border border-[#1B2E23] mb-3">
          <Navigation className="w-3.5 h-3.5 text-[#00C896] shrink-0" />
          <span className="truncate">{species.direction}</span>
        </div>

        {/* Acoustic Profile */}
        <p className="text-xs text-[#97A89D] mb-4 line-clamp-2 leading-relaxed">
          <strong className="text-[#F4F7F2]/90 font-medium">Acoustics: </strong>
          {species.audioCharacteristics}
        </p>
      </div>

      {/* Buttons Row with consistent sizes */}
      <div className="pt-3 border-t border-[#1B2E23] flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={handlePlayCall}
          disabled={isPlayingCall}
          className="cursor-pointer flex-1 h-8 inline-flex items-center justify-center gap-1.5 px-2.5 rounded-lg text-xs font-medium bg-[#070D0A] text-[#76D7A5] border border-[#1B2E23] hover:border-[#00C896]/40 transition-all disabled:opacity-50"
          title="Play species call"
        >
          <Music className={`w-3 h-3 ${isPlayingCall ? 'animate-bounce text-[#F2C94C]' : ''}`} />
          <span className="truncate">{isPlayingCall ? 'Calling...' : 'Call Audio'}</span>
        </button>

        <button
          onClick={handlePlayWhisper}
          disabled={isPlayingWhisper}
          className="cursor-pointer flex-1 h-8 inline-flex items-center justify-center gap-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[#182820] text-[#00C896] border border-[#00C896]/30 hover:bg-[#00C896]/15 transition-all disabled:opacity-50"
          title="Play 1-sentence whisper"
        >
          {isPlayingWhisper ? <Check className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          <span className="truncate">{isPlayingWhisper ? 'Playing...' : 'Whisper'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectDetails(species);
          }}
          className="cursor-pointer h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#182820] transition-colors shrink-0"
          title="View detailed species sheet"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
