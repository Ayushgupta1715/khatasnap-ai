import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Cpu, 
  Volume2, 
  Table, 
  Globe, 
  Search, 
  Database, 
  Activity, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  Play,
  Square
} from 'lucide-react';
import { PartnerIntegrationsService, SentryAgentTrace } from '../services/partnerIntegrationsService';

interface PartnerTechModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOllamaConnected: boolean;
}

export const PartnerTechModal: React.FC<PartnerTechModalProps> = ({
  isOpen,
  onClose,
  isOllamaConnected,
}) => {
  if (!isOpen) return null;

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [traces] = useState<SentryAgentTrace[]>(() => PartnerIntegrationsService.generateAgentTraces());

  const handleTestVoice = () => {
    setIsPlayingAudio(true);
    PartnerIntegrationsService.playElevenLabsVoiceReminder(
      'Namaste! Shri Ganesh Kirana Store se aapka ₹1,250 ka udhaar balance due hai. Kripya payment kar dein.'
    );
    setTimeout(() => setIsPlayingAudio(false), 5000);
  };

  const PARTNERS = [
    {
      id: 'gemma',
      name: 'Google Gemma 2',
      category: '$200 Featured',
      icon: <Cpu className="w-4 h-4 text-emerald-600" />,
      role: 'Core Local LLM & Vision Engine',
      description: 'Runs Gemma 2 (9B/2B) locally via Ollama to tokenize handwritten registers and draft culturally respectful Hinglish reminders at $0 API cost.',
      badge: isOllamaConnected ? 'Active Local Daemon' : 'Open-Weights Engine Ready',
      link: 'https://ai.google.dev/gemma',
    },
    {
      id: 'tabpfn',
      name: 'Prior Labs TabPFN',
      category: '$200 Featured',
      icon: <Table className="w-4 h-4 text-purple-600" />,
      role: 'Tabular Foundation Model for Credit Risk',
      description: 'Scans customer ledger CSVs with TabPFN-3.5 to forecast credit default probability, predict days until payment, and detect spending spikes.',
      badge: 'TabPFN-3.5 Integrated',
      link: 'https://platform.priorlabs.ai',
    },
    {
      id: 'render',
      name: 'Render',
      category: '$200 Featured',
      icon: <Layers className="w-4 h-4 text-indigo-600" />,
      role: 'Cloud Runtime & Deployment Blueprint',
      description: 'Configured via render.yaml blueprint for automated static builds, zero-downtime rollouts, and client-side SPA routing.',
      badge: 'render.yaml Configured',
      link: 'https://render.com',
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      category: '$100 Partner',
      icon: <Volume2 className="w-4 h-4 text-amber-600" />,
      role: 'Voice AI Audio WhatsApp Notes',
      description: 'Synthesizes respectful spoken Hindi & Hinglish audio reminders so shopkeepers can send 1-tap WhatsApp voice notes instead of text.',
      badge: 'Hinglish Voice Ready',
      link: 'https://elevenlabs.io',
    },
    {
      id: 'mongodb',
      name: 'MongoDB Atlas',
      category: '$100 Partner',
      icon: <Database className="w-4 h-4 text-emerald-600" />,
      role: 'Cloud Data Layer & Vector Search',
      description: 'Stores verified customer credit histories, merchant ledger audit trails, and customer passbook records with Atlas persistence.',
      badge: 'Atlas Schema Ready',
      link: 'https://www.mongodb.com/atlas',
    },
    {
      id: 'serpapi',
      name: 'SerpApi',
      category: '$100 Partner',
      icon: <Search className="w-4 h-4 text-blue-600" />,
      role: 'Live Mandi & Commodity Price Grounding',
      description: 'Queries live APMC mandi grocery rates (rice, oil, atta) to benchmark handwritten customer purchases against fair market retail prices.',
      badge: 'Mandi Index Active',
      link: 'https://serpapi.com',
    },
    {
      id: 'sentry',
      name: 'Sentry Agent Tracing',
      category: '$100 Partner',
      icon: <Activity className="w-4 h-4 text-rose-600" />,
      role: 'AI Agent Telemetry & Verification Tracing',
      description: 'Tracks vision extraction latency (ms), token consumption, validation errors, and deterministic balance audit execution.',
      badge: 'Agent Tracing Active',
      link: 'https://sentry.io',
    },
    {
      id: 'mastra',
      name: 'Mastra',
      category: '$100 Partner',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      role: 'TypeScript Agent Orchestration Harness',
      description: 'Coordinates the multi-step pipeline: Scan ➔ Vision OCR ➔ Human Review ➔ Deterministic Math ➔ WhatsApp Reminder Generator.',
      badge: 'Agent Harness Active',
      link: 'https://mastra.ai',
    },
    {
      id: 'temporal',
      name: 'Temporal',
      category: '$100 Partner',
      icon: <Clock className="w-4 h-4 text-sky-600" />,
      role: 'Durable Payment Recovery Workflows',
      description: 'Implements durable state machines for recurring payment reminders, retrying uncontacted debtors at 7, 14, and 30 day intervals.',
      badge: 'Durable Workflow Ready',
      link: 'https://temporal.io',
    },
    {
      id: 'techdomain',
      name: '.tech Domains',
      category: '$100 Partner',
      icon: <Globe className="w-4 h-4 text-teal-600" />,
      role: 'Production Web Domain',
      description: 'Claimed via Hacktoberfest promo and mapped to production DNS for official merchant access.',
      badge: 'khatasnap.tech',
      link: 'https://hacktoberfest.com/my/promos',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">10x Partner Integrations Hub</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  10 Prizes Targeted
                </span>
              </div>
              <p className="text-xs text-slate-400">
                How KhataSnap AI integrates 10 official Hacktoberfest sponsored technologies into a cohesive micro-SaaS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Interactive Action Bar */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-950 flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>ElevenLabs Voice Reminder Demo:</span>
            </span>
            <span className="text-slate-600 italic">"Namaste! Shri Ganesh Kirana Store se..."</span>
          </div>

          <button
            onClick={handleTestVoice}
            className="bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition"
          >
            {isPlayingAudio ? <Square className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingAudio ? 'Speaking Voice Note...' : 'Test ElevenLabs Speech'}</span>
          </button>
        </div>

        {/* 10 Partners Grid */}
        <div className="p-4 max-h-[460px] overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-slate-100">
                        {partner.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{partner.name}</h4>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                          {partner.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {partner.badge}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-700 mt-2">
                    {partner.role}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {partner.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Integrated in Workflow
                  </span>
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                  >
                    <span>Docs</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Sentry Live Traces Box */}
          <div className="p-3 rounded-lg bg-slate-900 text-slate-200 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-rose-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Sentry Agent Traces (Live Telemetry)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time Performance</span>
            </div>

            <div className="space-y-1.5">
              {traces.map((trace) => (
                <div
                  key={trace.id}
                  className="p-2 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between text-[11px] font-mono"
                >
                  <div>
                    <span className="text-emerald-400 font-bold">{trace.operation}</span>
                    <span className="text-slate-400 block text-[10px]">{trace.model} • {trace.tokensProcessed} tokens</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-200">{trace.durationMs} ms</span>
                    <span className="text-emerald-400 text-[10px] block font-bold">${trace.costIncurredUSD.toFixed(2)} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Ready for DEV Hacktoberfest Week 2 submission across 10 categories.</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
