import { useState } from 'react';
import { ShieldCheck, Compass, CheckCircle2, Copy, Download, Radio } from 'lucide-react';
import { Species } from '../types/trail';

interface SilentJournalProps {
  detections: Species[];
  walkDurationSeconds: number;
  screenTimeSeconds: number;
}

export const SilentJournal = ({
  detections,
  walkDurationSeconds,
  screenTimeSeconds
}: SilentJournalProps) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Calculate Outdoor Presence Ratio
  const totalWalkSeconds = Math.max(walkDurationSeconds, screenTimeSeconds, 1);
  const outdoorSeconds = Math.max(0, totalWalkSeconds - screenTimeSeconds);
  const outdoorRatio = ((outdoorSeconds / totalWalkSeconds) * 100).toFixed(1);

  const formatMins = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const downloadAuditLog = () => {
    const logData = {
      auditTimestamp: new Date().toISOString(),
      outdoorPresenceRatio: `${outdoorRatio}% Grass Touched`,
      totalWalkTime: formatMins(totalWalkSeconds),
      screenTimeEngaged: formatMins(screenTimeSeconds),
      totalDiscoveries: detections.length,
      discoveries: detections.map(d => ({
        species: d.commonName,
        scientific: d.scientificName,
        confidence: `${Math.round(d.confidence * 100)}%`,
        bearing: d.direction,
        sha256: d.sha256,
        modelArch: d.modelArch,
        timestamp: d.timestamp
      }))
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trailwhisper-silent-journal-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Post-Walk Audit Scorecard */}
      <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-xs font-mono text-[#00C896] mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>POST-WALK SILENT AUDIT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F2] tracking-tight">
              Outdoor Presence Ratio
            </h2>
            <p className="text-sm text-[#97A89D] mt-1 max-w-xl">
              TrailWhisper quietly indexed your sensory discoveries during the hike without vibrating or interrupting your presence with notifications.
            </p>
          </div>

          {/* Metric Badge */}
          <div className="bg-[#070D0A] p-5 rounded-2xl border border-[#1B2E23] text-left md:text-right shrink-0">
            <div className="text-4xl font-extrabold text-[#00C896] font-mono tracking-tight tabular-nums">
              {outdoorRatio}%
            </div>
            <div className="text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider mt-1">
              Grass Touched
            </div>
            <div className="text-[11px] font-mono text-[#97A89D] mt-0.5 tabular-nums">
              {formatMins(totalWalkSeconds)} hike • {formatMins(screenTimeSeconds)} screen
            </div>
          </div>
        </div>

        {/* Presence ratio progress bar */}
        <div className="w-full bg-[#070D0A] rounded-full h-2.5 border border-[#1B2E23] overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full bg-[#00C896] transition-all duration-500"
            style={{ width: `${outdoorRatio}%` }}
          />
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#1B2E23]">
          <div className="text-xs text-[#97A89D] font-mono">
            {detections.length} nature discoveries cataloged with cryptographic proof
          </div>
          <button
            onClick={downloadAuditLog}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#182820] text-[#F4F7F2] hover:bg-[#20372A] transition-colors border border-[#1B2E23]"
          >
            <Download className="w-3.5 h-3.5 text-[#00C896]" />
            <span>Export Verified Audit (JSON)</span>
          </button>
        </div>
      </div>

      {/* Discovery List with SHA-256 Hashes and Cardinal Bearings */}
      <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-6">
        <h3 className="text-lg font-bold text-[#F4F7F2] mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#00C896]" />
          <span>Cryptographic Trail Records & Cardinal Bearings</span>
        </h3>

        <div className="space-y-3">
          {detections.map((item, idx) => (
            <div 
              key={item.id + idx}
              className="bg-[#070D0A] rounded-xl border border-[#1B2E23] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#284434] transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#F4F7F2]">{item.commonName}</span>
                  {item.hindiName && (
                    <span className="text-xs text-[#00C896]">{item.hindiName}</span>
                  )}
                  <span className="text-xs font-mono italic text-[#97A89D]">({item.scientificName})</span>
                </div>

                {/* Cardinal Bearing */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 mt-1">
                  <Radio className="w-3.5 h-3.5 text-[#00C896]" />
                  <span>Bearing: {item.direction}</span>
                  <span className="text-[#97A89D]/50">•</span>
                  <span className="text-[#97A89D]">{item.timestamp}</span>
                </div>
              </div>

              {/* SHA-256 Hash with Copy */}
              <div className="flex items-center gap-2 bg-[#0E1712] px-3 py-1.5 rounded-lg border border-[#1B2E23]">
                <span className="text-[11px] font-mono text-[#97A89D] truncate max-w-[180px] sm:max-w-[240px]">
                  {item.sha256}
                </span>
                <button
                  onClick={() => copyToClipboard(item.sha256)}
                  className="cursor-pointer text-[#00C896] hover:text-[#76D7A5] transition-colors p-1"
                  title="Copy SHA-256 fingerprint"
                >
                  {copiedHash === item.sha256 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
