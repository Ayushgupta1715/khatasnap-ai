import { EyeOff, AlertTriangle, ArrowRight } from 'lucide-react';

interface PenaltyShieldProps {
  continuousGazeSeconds: number;
  thresholdSeconds: number;
  onDismiss: () => void;
}

export const PenaltyShield = ({
  continuousGazeSeconds,
  thresholdSeconds,
  onDismiss,
}: PenaltyShieldProps) => {
  if (continuousGazeSeconds < thresholdSeconds) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070D0A]/95 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0E1712] border border-[#F2C94C]/60 rounded-3xl p-8 text-center shadow-2xl">
        
        {/* Warning Icon with subtle pulsating ring */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2C94C]/10 border border-[#F2C94C]/30 mb-5 mx-auto">
          <EyeOff className="w-8 h-8 text-[#F2C94C]" />
          <span className="absolute inset-0 rounded-full border border-[#F2C94C]/20 animate-ping" />
        </div>

        {/* Shield Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2C94C]/10 border border-[#F2C94C]/30 text-xs font-mono text-[#F2C94C] mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ANTI-SCREEN PENALTY ACTIVE</span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#F4F7F2] tracking-tight mb-3">
          Put the Phone Away.
        </h2>

        {/* Challenge prompt message */}
        <p className="text-sm text-[#97A89D] leading-relaxed mb-6">
          &ldquo;Nature is happening in front of you, not behind this glass.&rdquo;
        </p>

        <div className="bg-[#070D0A] p-4 rounded-xl border border-[#1B2E23] mb-6 text-left">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-[#97A89D]">Continuous Gaze:</span>
            <span className="text-[#F2C94C] font-bold tabular-nums">{continuousGazeSeconds}s (Limit {thresholdSeconds}s)</span>
          </div>
          <div className="w-full bg-[#1B2E23] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#F2C94C] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (continuousGazeSeconds / (thresholdSeconds * 1.5)) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#97A89D] mt-2 leading-relaxed">
            Your pocket audio AI remains active in the background. Plug in earphones and walk freely.
          </p>
        </div>

        {/* Pocket it action */}
        <button
          onClick={onDismiss}
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00C896] text-[#070D0A] font-bold text-sm hover:bg-[#76D7A5] transition-all shadow-md"
        >
          <span>I am Pocketing the Phone</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
