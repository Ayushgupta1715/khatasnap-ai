import { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Leaf, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { SystemOfflineStatus } from '../types/trail';

interface HeaderProps {
  isOnline: boolean;
  screenTimeSeconds: number;
  activeTab: 'ear-first' | 'quests' | 'journal' | 'open-weights';
  setActiveTab: (tab: 'ear-first' | 'quests' | 'journal' | 'open-weights') => void;
  isListening: boolean;
  offlineStatus: SystemOfflineStatus;
  savedSightingsCount: number;
}

export const Header = ({
  isOnline,
  screenTimeSeconds,
  activeTab,
  setActiveTab,
  isListening,
  offlineStatus,
  savedSightingsCount,
}: HeaderProps) => {
  const [showStatusDetails, setShowStatusDetails] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#070D0A] backdrop-blur-md border-b border-[#1B2E23] z-[60] shadow-md transition-colors">
        <div className="max-w-[1100px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#0E1712] border border-[#1B2E23]">
              <Leaf className="w-5 h-5 text-[#00C896]" />
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C896] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00C896]" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-[#F4F7F2]">TrailWhisper</span>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#182820] text-[#00C896] font-semibold border border-[#00C896]/30">
                  EDGE AI
                </span>
              </div>
              <p className="text-[11px] text-[#97A89D] hidden md:block">Keep Eyes on the Canopy</p>
            </div>
          </div>

          {/* Center: Interactive Functional Offline Status Pill */}
          <div className="relative flex items-center gap-2 sm:gap-3">
            
            {/* Functional Offline Status Pill */}
            <button 
              onClick={() => setShowStatusDetails(!showStatusDetails)}
              className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${
                !isOnline 
                  ? 'bg-amber-500/10 text-[#F2C94C] border-[#F2C94C]/40 hover:bg-amber-500/20' 
                  : 'bg-emerald-500/10 text-[#00C896] border-[#00C896]/40 hover:bg-emerald-500/20'
              }`}
              title="Click to view detailed hardware/network edge status"
            >
              {!isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#F2C94C]" />
                  <span className="font-semibold text-[11px]">DEAD-ZONE</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#00C896]" />
                  <span className="text-[11px]">ON-DEVICE EDGE</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* Detailed System Status Dropdown */}
            {showStatusDetails && (
              <div className="absolute top-12 left-0 w-64 bg-[#0E1712] border border-[#1B2E23] rounded-2xl p-4 shadow-2xl z-50 animate-fade-in text-xs font-mono">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#1B2E23]">
                  <span className="font-bold text-[#F4F7F2]">EDGE SYSTEM STATUS</span>
                  <button 
                    onClick={() => setShowStatusDetails(false)}
                    className="text-[#97A89D] hover:text-[#F4F7F2]"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#97A89D]">Offline Model:</span>
                    <span className="text-[#00C896] font-bold">Ready (ONNX FP16)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#97A89D]">Audio Engine:</span>
                    <span className="text-[#F4F7F2] font-semibold">{offlineStatus.audioProcessing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#97A89D]">Network:</span>
                    <span className={!isOnline ? "text-[#F2C94C] font-bold" : "text-[#00C896]"}>
                      {offlineStatus.networkStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#97A89D]">Saved Sightings:</span>
                    <span className="text-[#76D7A5] font-bold">{savedSightingsCount} (Cached Offline)</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1B2E23] text-[10px] text-[#97A89D]">
                  Zero cloud telemetry transmitted on trail.
                </div>
              </div>
            )}

            {/* Live Screen Time Ticker with tabular nums */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-[#0E1712] border border-[#1B2E23] text-[#97A89D]">
              <Radio className="w-3 h-3 text-[#00C896] animate-pulse" />
              <span className="text-[11px] text-[#97A89D]">Screen:</span>
              <span className="text-[#F4F7F2] font-semibold tabular-nums text-[11px]">{formatTime(screenTimeSeconds)}</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('ear-first')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'ear-first'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold shadow-sm'
                  : 'text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#0E1712]'
              }`}
            >
              Ear-First
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'quests'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold shadow-sm'
                  : 'text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#0E1712]'
              }`}
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'journal'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold shadow-sm'
                  : 'text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#0E1712]'
              }`}
            >
              <span>Journal</span>
              {savedSightingsCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'journal' ? 'bg-[#070D0A] text-[#00C896]' : 'bg-[#182820] text-[#00C896]'
                }`}>
                  {savedSightingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('open-weights')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'open-weights'
                  ? 'bg-[#00C896] text-[#070D0A] font-semibold shadow-sm'
                  : 'text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#0E1712]'
              }`}
            >
              Open Model
            </button>
          </nav>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#97A89D] hover:text-[#F4F7F2] hover:bg-[#0E1712] transition-colors"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-[#070D0A] border-b border-[#1B2E23] p-4 z-50 md:hidden animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => { setActiveTab('ear-first'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'ear-first' ? 'bg-[#00C896] text-[#070D0A] font-bold' : 'bg-[#0E1712] text-[#F4F7F2]'
              }`}
            >
              🎧 Ear-First
            </button>
            <button
              onClick={() => { setActiveTab('quests'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'quests' ? 'bg-[#00C896] text-[#070D0A] font-bold' : 'bg-[#0E1712] text-[#F4F7F2]'
              }`}
            >
              🌿 Quests
            </button>
            <button
              onClick={() => { setActiveTab('journal'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'journal' ? 'bg-[#00C896] text-[#070D0A] font-bold' : 'bg-[#0E1712] text-[#F4F7F2]'
              }`}
            >
              <span>📓 Journal</span>
              {savedSightingsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#070D0A] text-[#00C896]">
                  {savedSightingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('open-weights'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'open-weights' ? 'bg-[#00C896] text-[#070D0A] font-bold' : 'bg-[#0E1712] text-[#F4F7F2]'
              }`}
            >
              ⚡ Open Model
            </button>
          </div>
          
          <div className="text-[11px] font-mono text-[#97A89D] flex justify-between px-1 pt-2 border-t border-[#1B2E23]">
            <span>Screen Time: {formatTime(screenTimeSeconds)}</span>
            <span>{isOnline ? 'Online / Edge Ready' : 'Dead-Zone Mode'}</span>
          </div>
        </div>
      )}
    </>
  );
};
