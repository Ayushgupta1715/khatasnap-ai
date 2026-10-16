import React, { useState } from 'react';
import { Users, Search, Phone, ArrowRight, ShieldAlert, CheckCircle2, UserPlus, AlertTriangle, Check } from 'lucide-react';
import { Customer, Transaction } from '../types/khata';
import { CustomerPassbookModal } from './CustomerPassbookModal';

interface CustomerLedgerProps {
  customers: Customer[];
  transactions: Transaction[];
  onAddTransaction: (customerId: string, tx: Omit<Transaction, 'id' | 'status' | 'confidence' | 'needsReview'>) => void;
  onOpenReminderModal: (customer: Customer) => void;
  onAddNewCustomer: (name: string, phone: string, address?: string) => void;
  onReconcileCustomer?: (customerId: string, targetBalance: number) => void;
}

export const CustomerLedger: React.FC<CustomerLedgerProps> = ({
  customers,
  transactions,
  onAddTransaction,
  onOpenReminderModal,
  onAddNewCustomer,
  onReconcileCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'cleared' | 'discrepancy'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterType === 'pending') return cust.currentBalance > 0;
    if (filterType === 'cleared') return cust.currentBalance <= 0;
    if (filterType === 'discrepancy') return cust.hasDiscrepancy;
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddNewCustomer(newName.trim(), newPhone.trim(), newAddress.trim());
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setShowAddCustomer(false);
  };

  const totalOutstandingAll = customers.reduce((sum, c) => sum + Math.max(0, c.currentBalance), 0);
  const discrepancyCount = customers.filter((c) => c.hasDiscrepancy).length;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#047857]" />
            <span>Customer Khata Ledger</span>
          </h2>
          <p className="text-xs text-slate-500">
            Active Accounts: <strong className="text-slate-800">{customers.length}</strong> • Verified Outstanding Balance: <strong className="text-rose-600">₹{totalOutstandingAll.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomer(!showAddCustomer)}
          className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs w-fit"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add New Customer</span>
        </button>
      </div>

      {/* Discrepancy Global Alert Banner */}
      {discrepancyCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Smart Reconciliation Alert:</strong> {discrepancyCount} customer account has an arithmetic discrepancy between recorded balance and transaction history.
            </span>
          </div>
          <button
            onClick={() => setFilterType('discrepancy')}
            className="text-amber-900 font-bold underline hover:text-amber-950 shrink-0"
          >
            Review Discrepancies →
          </button>
        </div>
      )}

      {/* Add Customer Modal / Drawer */}
      {showAddCustomer && (
        <form onSubmit={handleCreateCustomer} className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 animate-in fade-in">
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
            Register New Customer Account
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-0.5">Customer Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs p-1.5 border border-emerald-300 rounded-md bg-white"
                required
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-0.5">Phone Number *</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 00000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full text-xs p-1.5 border border-emerald-300 rounded-md bg-white"
                required
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-0.5">Address / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Shiv Mandir"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full text-xs p-1.5 border border-emerald-300 rounded-md bg-white"
              />
            </div>
          </div>
          <div className="mt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddCustomer(false)}
              className="text-xs text-slate-600 hover:text-slate-800 px-3 py-1 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-200 rounded-md focus:border-[#047857] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Accounts ({customers.length})
          </button>

          <button
            onClick={() => setFilterType('pending')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              filterType === 'pending'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({customers.filter((c) => c.currentBalance > 0).length})
          </button>

          <button
            onClick={() => setFilterType('cleared')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              filterType === 'cleared'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Cleared (0 Due)
          </button>

          {discrepancyCount > 0 && (
            <button
              onClick={() => setFilterType('discrepancy')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                filterType === 'discrepancy'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Discrepancy ({discrepancyCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <Users className="w-7 h-7 mx-auto mb-1 opacity-60" />
            <p className="text-xs font-semibold text-slate-600">No customers found.</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const hasPending = cust.currentBalance > 0;
            return (
              <div
                key={cust.id}
                className={`bg-white rounded-xl border p-3.5 shadow-xs transition flex flex-col justify-between ${
                  cust.hasDiscrepancy
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{cust.name}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                    </div>

                    {cust.hasDiscrepancy ? (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Mismatch
                      </span>
                    ) : cust.risk === 'high' ? (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        Overdue
                      </span>
                    ) : !hasPending ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Clear
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Regular
                      </span>
                    )}
                  </div>

                  {/* Smart Reconciliation Box if discrepancy exists */}
                  {cust.hasDiscrepancy && (
                    <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                      <span className="font-bold block text-[10px] uppercase text-amber-800">
                        Discrepancy Detected
                      </span>
                      <p className="mt-0.5 leading-tight">
                        Expected <strong>₹{cust.expectedBalance}</strong> vs Recorded ₹{cust.currentBalance}.
                      </p>
                      {onReconcileCustomer && (
                        <button
                          onClick={() => onReconcileCustomer(cust.id, cust.expectedBalance!)}
                          className="mt-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition"
                        >
                          <Check className="w-3 h-3" />
                          <span>Reconcile to ₹{cust.expectedBalance}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Math Breakdown Box */}
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>Total Purchases:</span>
                      <span className="font-mono font-medium">₹{cust.totalCredit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span>Total Paid:</span>
                      <span className="font-mono font-medium text-emerald-700">₹{cust.totalPaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Recorded Balance:</span>
                      <span
                        className={`text-sm font-black font-mono ${
                          hasPending ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        ₹{cust.currentBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="text-xs text-[#047857] hover:text-[#065f46] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>View Passbook</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {hasPending && (
                    <button
                      onClick={() => onOpenReminderModal(cust)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-[#047857] border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded transition cursor-pointer"
                    >
                      Reminder 💬
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Passbook Modal */}
      {selectedCustomer && (
        <CustomerPassbookModal
          customer={selectedCustomer}
          transactions={transactions}
          onClose={() => setSelectedCustomer(null)}
          onAddTransaction={onAddTransaction}
          onReconcileCustomer={(id, target) => {
            if (onReconcileCustomer) {
              onReconcileCustomer(id, target);
              setSelectedCustomer((prev) => prev ? { ...prev, currentBalance: target, hasDiscrepancy: false } : null);
            }
          }}
        />
      )}
    </div>
  );
};
