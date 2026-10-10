import { Check, Trophy, Compass, Bird, TreePine, Leaf, Bug, Wind, Sprout } from 'lucide-react';
import { BingoItem } from '../types/trail';
import { audioEngine } from '../utils/audio';

interface TrailBingoProps {
  items: BingoItem[];
  onToggle: (id: string) => void;
}

export const TrailBingo = ({ items, onToggle }: TrailBingoProps) => {
  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const handleCardClick = (item: BingoItem) => {
    if (!item.completed) {
      audioEngine.playSolfeggioChime(639, 1.5); // 639 Hz connection tone
    }
    onToggle(item.id);
  };

  const getQuestIcon = (id: string) => {
    switch (id) {
      case 'quest-birds':
        return <Bird className="w-5 h-5 text-[#00C896]" />;
      case 'quest-bark':
        return <TreePine className="w-5 h-5 text-[#76D7A5]" />;
      case 'quest-leaves':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'quest-pollinator':
        return <Bug className="w-5 h-5 text-[#F2C94C]" />;
      case 'quest-silence':
        return <Wind className="w-5 h-5 text-teal-300" />;
      case 'quest-plant':
        return <Sprout className="w-5 h-5 text-[#00C896]" />;
      default:
        return <Compass className="w-5 h-5 text-[#00C896]" />;
    }
  };

  return (
    <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-6 mb-8">
      {/* Header & Mission description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#F4F7F2]">Trail Bingo: Today&apos;s Nature Quest</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/30">
              Zero-Screen Walk
            </span>
          </div>
          <p className="text-xs text-[#97A89D]">
            Tap once with your thumb while hiking. No camera capture, no forms, no screen stares needed.
          </p>
        </div>

        {/* Progress & Badge with tabular numerals */}
        <div className="flex items-center gap-3 bg-[#070D0A] px-4 py-2 rounded-xl border border-[#1B2E23]">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-[#F4F7F2] tabular-nums">
              {completedCount} of {items.length} Complete
            </div>
            <div className="text-[10px] text-[#00C896] font-mono tabular-nums">
              {progressPercent === 100 ? 'TRAIL COMPLETED' : `${progressPercent}% Sensed`}
            </div>
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0E1712] border border-[#1B2E23]">
            {progressPercent === 100 ? (
              <Trophy className="w-5 h-5 text-[#F2C94C]" />
            ) : (
              <Compass className="w-5 h-5 text-[#00C896]" />
            )}
          </div>
        </div>
      </div>

      {/* 3x2 Interactive Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 select-none relative group ${
              item.completed
                ? 'bg-[#14221B] border-[#00C896] shadow-sm'
                : 'bg-[#070D0A] border-[#1B2E23] hover:border-[#284434] hover:bg-[#0c1410]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0E1712] border border-[#1B2E23] shrink-0">
                  {getQuestIcon(item.id)}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold transition-colors ${
                    item.completed ? 'text-[#00C896] line-through decoration-[#00C896]/60' : 'text-[#F4F7F2]'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#97A89D] mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* 1-Tap Checkbox */}
              <div className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                item.completed
                  ? 'bg-[#00C896] border-[#00C896] text-[#070D0A]'
                  : 'border-[#1B2E23] group-hover:border-[#76D7A5]/50 bg-[#0E1712]'
              }`}>
                {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>

            {item.completed && (
              <div className="mt-2.5 pt-2 border-t border-[#00C896]/20 flex items-center justify-between text-[10px] font-mono text-[#00C896]">
                <span>✓ Sensed on trail</span>
                <span>1-Tap Logged</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
