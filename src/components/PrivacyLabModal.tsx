import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Zap, 
  RefreshCw, 
  FileCode
} from 'lucide-react';
import { KhataAIService } from '../services/khataAIService';

interface PrivacyLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOllamaConnected: boolean;
  onRefreshOllama: () => void;
}

export const PrivacyLabModal: React.FC<PrivacyLabModalProps> = ({
  isOpen,
  onClose,
  isOllamaConnected,
  onRefreshOllama,
}) => {
  if (!isOpen) return null;

  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ running: boolean; models: string[] } | null>(null);

  const handleRunHealthCheck = async () => {
    setTestingConnection(true);
    const result = await KhataAIService.checkOllamaHealth();
    setTestResult(result);
    setTestingConnection(false);
    onRefreshOllama();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Open Innovation & Privacy Architecture</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  Hacktoberfest 2026 Core
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Why open-weight models (Gemma 2) beat proprietary cloud APIs for small business credit.
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto text-xs text-slate-600 leading-relaxed">
          {/* Live Ollama Connectivity Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Local Ollama Daemon Status
                </span>
                <span className="text-[11px] font-mono text-slate-500">(http://localhost:11434)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isOllamaConnected
                  ? '✅ Local Ollama daemon detected. Open-weight Gemma 2 vision model is ready for private local inference.'
                  : 'ℹ️ Ollama is not currently detected on port 11434. Embedded zero-cloud privacy engine is active.'}
              </p>
            </div>

            <button
              onClick={handleRunHealthCheck}
              disabled={testingConnection}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg border text-xs ${
              testResult.running ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {testResult.running ? (
                <div>
                  <strong>Daemon Active!</strong> Available models: {testResult.models.length > 0 ? testResult.models.join(', ') : 'None pulled yet (Run `ollama run gemma2`)'}
                </div>
              ) : (
                <div>
                  <strong>No Local Ollama Found:</strong> To run Gemma locally on your laptop, install Ollama and run <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ollama run gemma2</code>. KhataSnap automatically falls back to its embedded privacy engine.
                </div>
              )}
            </div>
          )}

          {/* 3 Pillars of Why Open Innovation Wins */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">1. Zero Cloud Data Leak</h4>
              <p className="text-[11px] text-slate-500">
                A kirana shopkeeper's credit register contains neighbors' names, phone numbers, and debts. Sending this to proprietary cloud LLMs violates trust. Open weights keep 100% of bytes on the device.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">2. Infinite Free Scans</h4>
              <p className="text-[11px] text-slate-500">
                Commercial vision APIs charge $0.02 - $0.05 per page. For a shopkeeper scanning 200 pages/month, cloud fees destroy profitability. Gemma 2 runs at <strong>$0 marginal cost</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">3. Deterministic Math</h4>
              <p className="text-[11px] text-slate-500">
                AI is only used for text perception. Account balances (<code className="text-slate-800 font-mono">Balance = Prev + Credit - Paid</code>) are computed purely in code, eliminating LLM arithmetic hallucinations.
              </p>
            </div>
          </div>

          {/* Prompt Architecture Sample */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                Structured Gemma Prompt & Schema Contract
              </span>
              <span className="text-emerald-400 font-bold">JSON Mode Enforced</span>
            </div>
            <pre className="text-[10px] font-mono bg-black/40 p-3 rounded-lg overflow-x-auto text-emerald-300">
{`// Strict Financial Extraction Contract
{
  "customer": "Rahul Sharma",
  "date": "2026-10-12",
  "description": "Rice 5kg, Sugar 2kg",
  "amount": 450,
  "type": "credit",
  "confidence": 0.96,
  "needs_review": false // True if ink stroke or overwriting is ambiguous
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Category Target: <strong>Best Use of Gemma</strong> & <strong>Side Hustle Overall Winner</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
