import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2,
  Volume2,
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Customer, PaymentReminder, ReminderStatus, ReminderTone } from '../types/khata';
import { KhataAIService } from '../services/khataAIService';
import { PartnerIntegrationsService } from '../services/partnerIntegrationsService';

interface PaymentRemindersProps {
  customers: Customer[];
  reminders: PaymentReminder[];
  onUpdateReminderStatus: (reminderId: string, newStatus: ReminderStatus) => void;
  onCreateReminder: (reminder: PaymentReminder) => void;
  onRecordFullPayment: (customerId: string, amount: number) => void;
  preselectedCustomer?: Customer | null;
}

export const PaymentReminders: React.FC<PaymentRemindersProps> = ({
  customers,
  reminders,
  onUpdateReminderStatus,
  onCreateReminder,
  onRecordFullPayment,
  preselectedCustomer,
}) => {
  // Pending customers only
  const pendingCustomers = customers.filter((c) => c.currentBalance > 0);

  const [selectedCustId, setSelectedCustId] = useState<string>(
    preselectedCustomer ? preselectedCustomer.id : (pendingCustomers[0]?.id || '')
  );
  const [tone, setTone] = useState<ReminderTone>('polite');
  const [shopName, setShopName] = useState<string>('Shri Ganesh Kirana Store');
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const activeCustomer = customers.find((c) => c.id === selectedCustId);

  const handlePlayVoice = () => {
    if (!generatedMessage) return;
    setIsPlayingAudio(true);
    PartnerIntegrationsService.playElevenLabsVoiceReminder(generatedMessage);
    setTimeout(() => setIsPlayingAudio(false), 6000);
  };

  // Auto-generate reminder when customer or tone changes
  useEffect(() => {
    if (activeCustomer && activeCustomer.currentBalance > 0) {
      const msg = KhataAIService.generateHinglishReminder(
        activeCustomer.name,
        activeCustomer.currentBalance,
        tone,
        shopName
      );
      setGeneratedMessage(msg);
    } else {
      setGeneratedMessage('');
    }
  }, [selectedCustId, tone, shopName, activeCustomer]);

  // Handle Send via WhatsApp
  const handleOpenWhatsApp = () => {
    if (!activeCustomer || !generatedMessage) return;

    // Save reminder to tracking list if not already there
    const existing = reminders.find((r) => r.customerId === activeCustomer.id);
    if (!existing) {
      onCreateReminder({
        id: `rem-${Date.now()}`,
        customerId: activeCustomer.id,
        customerName: activeCustomer.name,
        phone: activeCustomer.phone,
        pendingAmount: activeCustomer.currentBalance,
        messageText: generatedMessage,
        tone,
        status: 'contacted',
        createdAt: new Date().toLocaleString(),
        lastSentAt: new Date().toLocaleString(),
      });
    } else {
      onUpdateReminderStatus(existing.id, 'contacted');
    }

    const waUrl = KhataAIService.getWhatsAppUrl(activeCustomer.phone, generatedMessage);
    window.open(waUrl, '_blank');
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleMarkAsPaid = (reminder: PaymentReminder) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#15803D', '#16A34A', '#FACC15', '#4ADE80'],
    });

    onUpdateReminderStatus(reminder.id, 'paid');
    onRecordFullPayment(reminder.customerId, reminder.pendingAmount);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BellRing className="w-5 h-5 text-emerald-600" />
          <span>Hinglish Payment Reminder Generator & Follow-up Tracker</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate polite, culturally respectful reminders in Hindi & Hinglish using verified ledger balances. Track payments until money is recovered.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Generator Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Draft New Reminder</span>
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
              Verified Amount Only
            </span>
          </div>

          {/* Customer Selection */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Customer with Pending Balance
            </label>
            {pendingCustomers.length === 0 ? (
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-lg">
                🎉 All customer balances are currently cleared! No pending udhaar.
              </p>
            ) : (
              <select
                value={selectedCustId}
                onChange={(e) => setSelectedCustId(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:border-emerald-600 focus:bg-white focus:outline-none"
              >
                {pendingCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — Pending ₹{c.currentBalance.toLocaleString('en-IN')} ({c.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Message Tone (Cultural Etiquette)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'polite', label: 'Namaste (Polite)', desc: 'Gentle & respectful' },
                  { id: 'friendly', label: 'Friendly', desc: 'Casual check-in' },
                  { id: 'formal', label: 'Official Notice', desc: 'For delayed dues' },
                  { id: 'urgent', label: 'Urgent', desc: 'Overdue warning' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2 rounded-lg text-left border transition cursor-pointer ${
                    tone === t.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-bold">{t.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shop Name Customization */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Shop Name (Sign-off)
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          {/* Live Editable Output Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Generated Message (Editable)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {generatedMessage.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={generatedMessage}
              onChange={(e) => setGeneratedMessage(e.target.value)}
              className="w-full text-xs leading-relaxed p-3 border border-emerald-300 rounded-xl bg-emerald-50/30 text-slate-800 focus:outline-none focus:border-emerald-600 font-sans"
              placeholder="Select a customer to generate reminder..."
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              disabled={!activeCustomer || !generatedMessage}
              className="w-full sm:flex-1 bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via WhatsApp (wa.me)</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={!generatedMessage}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* ElevenLabs Partner Voice Note Audio Integration */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePlayVoice}
              disabled={!generatedMessage}
              className={`text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-2 border transition cursor-pointer disabled:opacity-50 ${
                isPlayingAudio
                  ? 'bg-purple-100 border-purple-400 text-purple-800 animate-pulse'
                  : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{isPlayingAudio ? 'Speaking Voice Reminder...' : 'Play ElevenLabs Voice Note'}</span>
              <span className="text-[10px] bg-purple-200/80 text-purple-800 font-mono px-1 rounded">Hindi TTS</span>
            </button>

            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Mic className="w-3 h-3 text-purple-500" />
              ElevenLabs Voice AI
            </span>
          </div>
        </div>

        {/* Right Side: Recovery Tracking Pipeline */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Payment Follow-up Pipeline
              </span>
              <p className="text-[11px] text-slate-500">
                Track pending reminders until customer settles the bill
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {reminders.length} Tracked
            </span>
          </div>

          {/* Reminder Cards Stream */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {reminders.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No reminders sent yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Draft a reminder on the left to start recovery tracking.
                </p>
              </div>
            ) : (
              reminders.map((rem) => {
                const isPaid = rem.status === 'paid';
                return (
                  <div
                    key={rem.id}
                    className={`p-3.5 rounded-xl border transition ${
                      isPaid
                        ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                        : rem.status === 'contacted'
                        ? 'bg-sky-50/50 border-sky-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{rem.customerName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{rem.phone}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-2">
                          "{rem.messageText}"
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold font-mono text-rose-600 block">
                          ₹{rem.pendingAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{rem.createdAt}</span>
                      </div>
                    </div>

                    {/* Status & Actions footer */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Status:</span>
                        <select
                          value={rem.status}
                          onChange={(e) => onUpdateReminderStatus(rem.id, e.target.value as ReminderStatus)}
                          className="text-[11px] font-semibold py-0.5 px-1.5 rounded border border-slate-300 bg-white"
                        >
                          <option value="reminder_prepared">Draft Prepared</option>
                          <option value="contacted">Sent on WhatsApp</option>
                          <option value="partially_paid">Partially Paid</option>
                          <option value="paid">Payment Received ✓</option>
                          <option value="disputed">Disputed Amount</option>
                        </select>
                      </div>

                      {!isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(rem)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Paid ✓</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
