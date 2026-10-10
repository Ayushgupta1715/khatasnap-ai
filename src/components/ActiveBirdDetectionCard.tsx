import { useState } from 'react';
import { Volume2, Music, Bookmark, BookmarkCheck, Info, Navigation, Check } from 'lucide-react';
import { Species } from '../types/trail';
import { audioEngine } from '../utils/audio';

interface ActiveBirdDetectionCardProps {
  detection: Species;
  onSaveSighting: (species: Species) => void;
  isSaved: boolean;
  onViewDetails: (species: Species) => void;
}

export const ActiveBirdDetectionCard = ({
  detection,
  onSaveSighting,
  isSaved,
  onViewDetails
}: ActiveBirdDetectionCardProps) => {
  const [isPlayingWhisper, setIsPlayingWhisper] = useState(false);
  const [isPlayingCall, setIsPlayingCall] = useState(false);

  const handlePlayWhisper = () => {
    setIsPlayingWhisper(true);
    audioEngine.whisperSentence(detection.whisperText, () => {
      setIsPlayingWhisper(false);
    });
  };

  const handlePlayBirdCall = () => {
    setIsPlayingCall(true);
    audioEngine.playSimulatedBirdCall(detection.id);
    setTimeout(() => setIsPlayingCall(false), 2400);
  };

  return (
    <div className="bg-[#14221B] rounded-2xl border-2 border-[#00C896] p-5 sm:p-6 shadow-md shadow-[#00C896]/10 mb-8 transition-all">
      {/* Header bar: Status + Real Timestamp + Verified Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00C896]/20 text-[#00C896] border border-[#00C896]/40 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
            LATEST TRAIL DETECTION
          </span>
          <span className="text-[11px] font-mono text-[#97A89D]">
            {detection.badge === 'LIVE EDGE' ? '• Model: BirdNET-Mini ONNX' : '• Model: Demo Acoustic'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#97A89D]">Sensed at: <strong className="text-[#F4F7F2]">{detection.timestamp}</strong></span>
          <span className="px-2 py-0.5 rounded bg-[#070D0A] text-[#00C896] font-bold border border-[#1B2E23] tabular-nums">
            {Math.round(detection.confidence * 100)}% Conf
          </span>
        </div>
      </div>

      {/* Bird Title & Scientific Name */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F4F7F2] flex items-center gap-2">
            <span>{detection.commonName}</span>
            {detection.hindiName && (
              <span className="text-sm font-normal text-[#00C896]">({detection.hindiName})</span>
            )}
          </h3>
          <p className="text-xs font-mono italic text-[#97A89D]">{detection.scientificName}</p>
        </div>

        {/* Direction bearing */}
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-[#070D0A] px-3 py-1 rounded-lg border border-[#1B2E23] shrink-0">
          <Navigation className="w-3.5 h-3.5 text-[#00C896]" />
          <span>{detection.direction}</span>
        </div>
      </div>

      {/* The Whisper Sentence (Ear-First Output) */}
      <div className="bg-[#070D0A]/80 rounded-xl p-3.5 border border-[#1B2E23] mb-4">
        <span className="text-[10px] font-mono text-[#00C896] uppercase tracking-wider block mb-1">
          Headphone Whisper:
        </span>
        <p className="text-base sm:text-lg italic text-[#F4F7F2] font-serif leading-relaxed">
          &ldquo;{detection.whisperText}&rdquo;
        </p>
      </div>

      {/* Why This Bird? (Identification Explanation) */}
      {detection.whyThisBird && (
        <div className="bg-[#0E1712] rounded-xl p-3 border border-[#1B2E23] mb-5 text-xs text-[#97A89D]">
          <span className="text-[#F4F7F2] font-semibold flex items-center gap-1.5 mb-1">
            <Info className="w-3.5 h-3.5 text-[#00C896]" />
            Why this bird? (Acoustic Explanation)
          </span>
          <p className="leading-relaxed">{detection.whyThisBird}</p>
          {detection.frequencyRange && (
            <span className="inline-block mt-1 font-mono text-[10px] text-[#76D7A5]">
              Frequency Band: {detection.frequencyRange} • Latency: {detection.latencyMs}ms
            </span>
          )}
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#1B2E23]">
        {/* 1. Listen to Whisper */}
        <button
          onClick={handlePlayWhisper}
          disabled={isPlayingWhisper}
          className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#00C896] text-[#070D0A] hover:bg-[#76D7A5] transition-all disabled:opacity-50"
        >
          {isPlayingWhisper ? <Check className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlayingWhisper ? 'Whispering...' : 'Listen Whisper'}</span>
        </button>

        {/* 2. Listen to Actual Bird Call */}
        <button
          onClick={handlePlayBirdCall}
          disabled={isPlayingCall}
          className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#182820] text-[#00C896] border border-[#00C896]/30 hover:bg-[#00C896]/15 transition-all disabled:opacity-50"
          title="Synthesize and play the bird's acoustic frequency sequence"
        >
          <Music className={`w-3.5 h-3.5 ${isPlayingCall ? 'animate-bounce text-[#F2C94C]' : ''}`} />
          <span>{isPlayingCall ? 'Playing Call Audio...' : 'Listen to Call'}</span>
        </button>

        {/* 3. Save Sighting Button */}
        <button
          onClick={() => onSaveSighting(detection)}
          className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isSaved
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
              : 'bg-[#0E1712] text-[#F4F7F2] border-[#1B2E23] hover:border-[#284434]'
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[#00C896]" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Saved in Journal' : 'Save Sighting'}</span>
        </button>

        {/* 4. Detailed Modal View Trigger */}
        <button
          onClick={() => onViewDetails(detection)}
          className="cursor-pointer ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#0E1712] transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Full Species Info</span>
        </button>
      </div>

    </div>
  );
};
