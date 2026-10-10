import { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Download, 
  Search, 
  Calendar, 
  Compass, 
  Volume2, 
  Music, 
  WifiOff, 
  Sparkles
} from 'lucide-react';
import { SavedSighting } from '../types/trail';
import { audioEngine } from '../utils/audio';

interface TrailJournalProps {
  sightings: SavedSighting[];
  onRemoveSighting: (id: string) => void;
  onClearAll: () => void;
  onQuickAddSample: () => void;
}

export const TrailJournal = ({
  sightings,
  onRemoveSighting,
  onClearAll,
  onQuickAddSample
}: TrailJournalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bird' | 'tree'>('all');

  const filteredSightings = sightings.filter((item) => {
    const matchesSearch = 
      item.species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.species.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.species.hindiName && item.species.hindiName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || item.species.type === filterType;

    return matchesSearch && matchesType;
  });

  const exportJournalJson = () => {
    const exportData = {
      title: "TrailWhisper Offline Field Journal",
      exportedAt: new Date().toISOString(),
      verifiedOffline: true,
      totalSightings: sightings.length,
      records: sightings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trailwhisper-journal-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Journal Header Bar */}
      <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-xs font-mono text-[#00C896] mb-2">
              <WifiOff className="w-3.5 h-3.5" />
              <span>100% OFFLINE PERSISTENT JOURNAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F2] tracking-tight">
              My Trail Journal
            </h2>
            <p className="text-xs sm:text-sm text-[#97A89D] mt-1">
              Your field sightings are saved directly in local storage. Browse, search, and export your discoveries anytime—no internet required.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {sightings.length > 0 && (
              <button
                onClick={exportJournalJson}
                className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#182820] text-[#00C896] border border-[#00C896]/30 hover:bg-[#00C896]/15 transition-all"
                title="Download JSON offline backup"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Journal</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#1B2E23]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#97A89D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bird or flora..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070D0A] border border-[#1B2E23] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F7F2] placeholder-[#97A89D] focus:border-[#00C896] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                filterType === 'all'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold'
                  : 'bg-[#070D0A] text-[#97A89D] border border-[#1B2E23]'
              }`}
            >
              All ({sightings.length})
            </button>
            <button
              onClick={() => setFilterType('bird')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                filterType === 'bird'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold'
                  : 'bg-[#070D0A] text-[#97A89D] border border-[#1B2E23]'
              }`}
            >
              Birds
            </button>
            <button
              onClick={() => setFilterType('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                filterType === 'tree'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold'
                  : 'bg-[#070D0A] text-[#97A89D] border border-[#1B2E23]'
              }`}
            >
              Flora
            </button>
          </div>

          {sightings.length > 0 && (
            <button
              onClick={onClearAll}
              className="cursor-pointer ml-auto text-xs text-rose-400/80 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Journal</span>
            </button>
          )}
        </div>
      </div>

      {/* Sightings List */}
      {filteredSightings.length === 0 ? (
        <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-10 text-center">
          <Bookmark className="w-10 h-10 text-[#97A89D]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#F4F7F2] mb-1">No Saved Sightings Yet</h3>
          <p className="text-xs text-[#97A89D] max-w-md mx-auto mb-5">
            When you hear a bird on trail or test a detection in Ear-First mode, click &ldquo;Save Sighting&rdquo; to store it here for offline viewing.
          </p>
          <button
            onClick={onQuickAddSample}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#182820] text-[#00C896] border border-[#00C896]/30 hover:bg-[#00C896]/15 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Sample Sighting to Journal</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredSightings.map((sighting) => (
            <div
              key={sighting.id}
              className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-4 sm:p-5 hover:border-[#284434] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-base text-[#F4F7F2]">
                    {sighting.species.commonName}
                  </span>
                  {sighting.species.hindiName && (
                    <span className="text-xs font-medium text-[#00C896]">
                      {sighting.species.hindiName}
                    </span>
                  )}
                  <span className="text-xs font-mono italic text-[#97A89D]">
                    ({sighting.species.scientificName})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#070D0A] text-[10px] font-mono text-[#00C896] border border-[#1B2E23]">
                    {Math.round(sighting.species.confidence * 100)}% Match
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#97A89D]">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Compass className="w-3.5 h-3.5" />
                    {sighting.species.direction}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(sighting.savedAt).toLocaleDateString()} at {new Date(sighting.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {sighting.species.whyThisBird && (
                  <p className="text-xs text-[#97A89D] pt-1">
                    {sighting.species.whyThisBird}
                  </p>
                )}
              </div>

              {/* Action Buttons for this item */}
              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1B2E23]">
                <button
                  onClick={() => audioEngine.playSimulatedBirdCall(sighting.species.id)}
                  className="cursor-pointer h-8 px-3 rounded-lg text-xs font-medium bg-[#070D0A] text-[#76D7A5] border border-[#1B2E23] hover:border-[#00C896]/40 transition-colors flex items-center gap-1.5"
                  title="Play species call"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>

                <button
                  onClick={() => audioEngine.whisperSentence(sighting.species.whisperText)}
                  className="cursor-pointer h-8 px-3 rounded-lg text-xs font-medium bg-[#182820] text-[#00C896] border border-[#00C896]/30 hover:bg-[#00C896]/15 transition-colors flex items-center gap-1.5"
                  title="Play whisper"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Whisper</span>
                </button>

                <button
                  onClick={() => onRemoveSighting(sighting.id)}
                  className="cursor-pointer h-8 w-8 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
