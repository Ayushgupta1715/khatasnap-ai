import React from 'react';
import { Camera, Cpu, Users, BellRing, BarChart3, ShieldCheck } from 'lucide-react';
import { DashboardMetrics } from '../types/khata';

interface KhataHeaderProps {
  activeTab: 'scanner' | 'customers' | 'reminders' | 'dashboard';
  setActiveTab: (tab: 'scanner' | 'customers' | 'reminders' | 'dashboard') => void;
  metrics: DashboardMetrics;
  onOpenPrivacyLab: () => void;
  onNewScan: () => void;
  isOllamaConnected: boolean;
}

export const KhataHeader: React.FC<KhataHeaderProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  onOpenPrivacyLab,
  onNewScan,
  isOllamaConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Compact Top Banner: Privacy & Local Open-Weight guarantee */}
      <div className="bg-slate-900 text-slate-200 text-[11px] px-3 sm:px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOllamaConnected ? 'bg-emerald-400' : 'bg-emerald-500'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOllamaConnected ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="font-medium tracking-tight">
            {isOllamaConnected ? (
              <span className="text-emerald-400 font-semibold">Local Gemma 2 Vision Active (Ollama 11434)</span>
            ) : (
              <span className="text-slate-300">Local Open-Weight AI (On-Device Gemma 2)</span>
            )}
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-emerald-400 hidden md:inline flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3 h-3" />
            Zero Cloud Data Transmission • Strict Client-Side Privacy
          </span>
        </div>

        <button
          onClick={onOpenPrivacyLab}
          className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer"
        >
          <Cpu className="w-3 h-3" />
          <span>Open Innovation Lab</span>
        </button>
      </div>

      {/* Main Navbar - Compact height h-14 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-14">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#047857] flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Khata<span className="text-[#047857]">Snap</span>
                </span>
                <span className="bg-emerald-100 text-[#047857] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  AI v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Pills with Clear Database-Driven Counts */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-emerald-50 text-[#047857] shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Khata</span>
              {metrics.recordsNeedingVerification > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {metrics.recordsNeedingVerification} review
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-emerald-50 text-[#047857] shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customers</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono font-bold">
                {metrics.totalCustomers}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'reminders'
                  ? 'bg-emerald-50 text-[#047857] shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Reminders</span>
              {metrics.totalRemindersPending > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {metrics.totalRemindersPending} pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-[#047857] shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </nav>

          {/* Quick CTA button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewScan}
              className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Scan Page</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
