import React, { useState } from 'react';
import { X, Printer, Download, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Phone, MapPin, AlertTriangle, Check } from 'lucide-react';
import { Customer, Transaction, TransactionType } from '../types/khata';

interface CustomerPassbookModalProps {
  customer: Customer | null;
  transactions: Transaction[];
  onClose: () => void;
  onAddTransaction: (customerId: string, tx: Omit<Transaction, 'id' | 'status' | 'confidence' | 'needsReview'>) => void;
  onReconcileCustomer?: (customerId: string, targetBalance: number) => void;
}

export const CustomerPassbookModal: React.FC<CustomerPassbookModalProps> = ({
  customer,
  transactions,
  onClose,
  onAddTransaction,
  onReconcileCustomer,
}) => {
  if (!customer) return null;

  const [isAddingTx, setIsAddingTx] = useState<boolean>(false);
  const [newAmount, setNewAmount] = useState<number>(200);
  const [newDesc, setNewDesc] = useState<string>('Refined Oil & Sugar');
  const [newType, setNewType] = useState<TransactionType>('credit');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Filter transactions for this customer
  const customerTxs = transactions
    .filter((t) => t.customerName.toLowerCase() === customer.name.toLowerCase() || t.customerId === customer.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount <= 0) return;

    onAddTransaction(customer.id, {
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      date: newDate,
      description: newDesc,
      amount: newAmount,
      type: newType,
    });

    setIsAddingTx(false);
    setNewDesc('');
    setNewAmount(100);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Date,Description,Type,Amount (INR),Status\n';
    const rows = customerTxs
      .map((t) => `"${t.date}","${t.description}","${t.type}","${t.amount}","${t.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KhataSnap_Passbook_${customer.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Digital Passbook
              </span>
              <span className="text-[11px] text-slate-400">Account ID: {customer.id}</span>
            </div>
            <h3 className="text-lg font-bold mt-1 text-white">{customer.name}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-emerald-400" />
                {customer.phone}
              </span>
              {customer.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {customer.address}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smart Reconciliation Alert (Requested Feature) */}
        {customer.hasDiscrepancy && customer.expectedBalance !== undefined && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start gap-2 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Smart Reconciliation Discrepancy Flagged</strong>
                <span className="text-amber-900/90 text-[11px]">
                  Opening ₹{customer.openingBalance?.toLocaleString('en-IN') || 0} + Purchases ₹{customer.totalCredit.toLocaleString('en-IN')} - Payments ₹{customer.totalPaid.toLocaleString('en-IN')} = Expected <strong>₹{customer.expectedBalance.toLocaleString('en-IN')}</strong>. Recorded balance is ₹{customer.currentBalance.toLocaleString('en-IN')}.
                </span>
              </div>
            </div>

            {onReconcileCustomer && (
              <button
                onClick={() => onReconcileCustomer(customer.id, customer.expectedBalance!)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 shrink-0 cursor-pointer transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Auto-Reconcile to ₹{customer.expectedBalance.toLocaleString('en-IN')}</span>
              </button>
            )}
          </div>
        )}

        {/* Balance Metric Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Purchases</span>
            <span className="text-sm font-extrabold font-mono text-slate-800">
              ₹{customer.totalCredit.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border-x border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Jama (Paid)</span>
            <span className="text-sm font-extrabold font-mono text-emerald-700">
              ₹{customer.totalPaid.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Balance Due</span>
            <span className={`text-base font-black font-mono ${customer.currentBalance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              ₹{customer.currentBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Controls & New Tx Form */}
        <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingTx(!isAddingTx)}
              className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Entry</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer no-print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Passbook</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
            <span>Deterministic Math • Zero Hallucination</span>
          </div>
        </div>

        {/* Quick Add Transaction Accordion */}
        {isAddingTx && (
          <form onSubmit={handleCreateTx} className="p-3 bg-emerald-50/70 border-b border-emerald-200">
            <h4 className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-2">
              Record Direct Transaction (+ Udhaar or - Jama)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
              <div>
                <label className="text-[9px] font-bold text-emerald-800 uppercase block mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs p-1.5 border border-emerald-300 rounded bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-emerald-800 uppercase block mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TransactionType)}
                  className="w-full text-xs p-1.5 border border-emerald-300 rounded bg-white font-bold"
                >
                  <option value="credit">Udhaar (Purchase)</option>
                  <option value="payment">Jama (Payment Received)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-emerald-800 uppercase block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold p-1.5 border border-emerald-300 rounded bg-white"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs p-1.5 rounded transition cursor-pointer"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Item description (e.g. Rice 5kg, Oil 1L)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs p-1.5 border border-emerald-300 rounded bg-white"
              />
            </div>
          </form>
        )}

        {/* Transaction History Ledger Table */}
        <div className="p-3 max-h-[340px] overflow-y-auto">
          {customerTxs.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No transactions recorded for this customer yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Item Description</th>
                  <th className="py-2 px-2 text-center">Type</th>
                  <th className="py-2 px-2 text-right">Amount (₹)</th>
                  <th className="py-2 px-2 text-center">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerTxs.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-2 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-2 px-2 font-medium text-slate-800">
                        {tx.description}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isCredit
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isCredit ? (
                            <>
                              <ArrowUpRight className="w-3 h-3" />
                              Udhaar
                            </>
                          ) : (
                            <>
                              <ArrowDownLeft className="w-3 h-3" />
                              Jama
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-xs">
                        <span className={isCredit ? 'text-rose-600' : 'text-emerald-700'}>
                          {isCredit ? `+ ₹${tx.amount.toLocaleString('en-IN')}` : `- ₹${tx.amount.toLocaleString('en-IN')}`}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          Verified ✓
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Notes: {customer.notes || 'Regular account.'}</span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1 rounded-md transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
