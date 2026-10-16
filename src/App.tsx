import { useState, useEffect } from 'react';
import { KhataHeader } from './components/KhataHeader';
import { KhataScanner } from './components/KhataScanner';
import { CustomerLedger } from './components/CustomerLedger';
import { PaymentReminders } from './components/PaymentReminders';
import { RecoveryDashboard } from './components/RecoveryDashboard';
import { PrivacyLabModal } from './components/PrivacyLabModal';
import { PartnerTechModal } from './components/PartnerTechModal';
import { Customer, DashboardMetrics, PaymentReminder, ReminderStatus, Transaction } from './types/khata';
import { INITIAL_CUSTOMERS, INITIAL_REMINDERS, INITIAL_TRANSACTIONS } from './data/mockKhata';
import { KhataAIService } from './services/khataAIService';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  // Persistent or initial state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('khatasnap_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CUSTOMERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('khatasnap_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TRANSACTIONS;
  });

  const [reminders, setReminders] = useState<PaymentReminder[]>(() => {
    const saved = localStorage.getItem('khatasnap_reminders');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_REMINDERS;
  });

  const [activeTab, setActiveTab] = useState<'scanner' | 'customers' | 'reminders' | 'dashboard'>('scanner');
  const [showPrivacyLab, setShowPrivacyLab] = useState<boolean>(false);
  const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean>(false);
  const [preselectedCustomer, setPreselectedCustomer] = useState<Customer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('khatasnap_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('khatasnap_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('khatasnap_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check Ollama on launch
  useEffect(() => {
    KhataAIService.checkOllamaHealth().then((res) => {
      setIsOllamaConnected(res.running);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute live dashboard metrics
  const totalOutstanding = customers.reduce((sum, c) => sum + Math.max(0, c.currentBalance), 0);
  const customersWithPending = customers.filter((c) => c.currentBalance > 0).length;
  const paymentsReceivedThisMonth = transactions
    .filter((t) => t.type === 'payment' && t.status === 'verified')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRemindersPending = reminders.filter((r) => r.status !== 'paid').length;
  const recordsNeedingVerification = transactions.filter((t) => t.needsReview).length;

  const metrics: DashboardMetrics = {
    totalOutstanding,
    customersWithPending,
    paymentsReceivedThisMonth,
    recordsNeedingVerification,
    totalCustomers: customers.length,
    totalRemindersPending,
  };

  const handleReconcileCustomer = (customerId: string, targetBalance: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, currentBalance: targetBalance, hasDiscrepancy: false, discrepancyNote: undefined }
          : c
      )
    );
    showToast(`Account auto-reconciled to ₹${targetBalance.toLocaleString('en-IN')}`);
  };

  // Handle batch approval from scanner
  const handleApproveTransactions = (approvedEntries: Transaction[]) => {
    // 1. Mark status as verified
    const verifiedEntries = approvedEntries.map((e) => ({
      ...e,
      status: 'verified' as const,
      needsReview: false,
    }));

    // 2. Add to transaction list
    setTransactions((prev) => [...verifiedEntries, ...prev]);

    // 3. Update customer balances deterministically
    setCustomers((prevCustomers) => {
      const updated = [...prevCustomers];

      verifiedEntries.forEach((entry) => {
        let cust = updated.find(
          (c) => c.name.toLowerCase() === entry.customerName.toLowerCase() || (entry.phone && c.phone === entry.phone)
        );

        if (!cust) {
          // Auto create customer account if new
          const newCust: Customer = {
            id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: entry.customerName,
            phone: entry.phone || '+91 98000 00000',
            totalCredit: entry.type === 'credit' ? entry.amount : 0,
            totalPaid: entry.type === 'payment' ? entry.amount : 0,
            currentBalance: entry.type === 'credit' ? entry.amount : -entry.amount,
            lastTransactionDate: entry.date,
            risk: 'low',
          };
          updated.push(newCust);
        } else {
          // Update existing customer math
          if (entry.type === 'credit') {
            cust.totalCredit += entry.amount;
          } else {
            cust.totalPaid += entry.amount;
          }
          cust.currentBalance = cust.totalCredit - cust.totalPaid;
          cust.lastTransactionDate = entry.date;
          if (cust.currentBalance > 2000) {
            cust.risk = 'high';
          } else if (cust.currentBalance > 1000) {
            cust.risk = 'moderate';
          } else {
            cust.risk = 'low';
          }
        }
      });

      return updated;
    });

    showToast(`✅ ${verifiedEntries.length} entries verified and saved to ledger!`);
    setActiveTab('customers');
  };

  // Add individual manual transaction
  const handleAddTransaction = (
    customerId: string,
    txData: Omit<Transaction, 'id' | 'status' | 'confidence' | 'needsReview'>
  ) => {
    const newTx: Transaction = {
      ...txData,
      id: `manual-tx-${Date.now()}`,
      status: 'verified',
      confidence: 1.0,
      needsReview: false,
    };

    setTransactions((prev) => [newTx, ...prev]);

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const totalCredit = txData.type === 'credit' ? c.totalCredit + txData.amount : c.totalCredit;
          const totalPaid = txData.type === 'payment' ? c.totalPaid + txData.amount : c.totalPaid;
          return {
            ...c,
            totalCredit,
            totalPaid,
            currentBalance: totalCredit - totalPaid,
            lastTransactionDate: txData.date,
          };
        }
        return c;
      })
    );

    showToast(`Recorded ₹${txData.amount} for ${txData.customerName}`);
  };

  // Add new customer
  const handleAddNewCustomer = (name: string, phone: string, address?: string) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      address,
      totalCredit: 0,
      totalPaid: 0,
      currentBalance: 0,
      lastTransactionDate: new Date().toISOString().split('T')[0],
      risk: 'low',
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Registered new customer: ${name}`);
  };

  // When customer is marked paid from reminder
  const handleRecordFullPayment = (customerId: string, amount: number) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    handleAddTransaction(customerId, {
      customerId,
      customerName: cust.name,
      phone: cust.phone,
      date: new Date().toISOString().split('T')[0],
      description: 'Full payment settlement received',
      amount,
      type: 'payment',
    });

    showToast(`🎉 ₹${amount} received from ${cust.name}! Account cleared.`);
  };

  // Update reminder status
  const handleUpdateReminderStatus = (reminderId: string, newStatus: ReminderStatus) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, status: newStatus } : r))
    );
  };

  const handleCreateReminder = (reminder: PaymentReminder) => {
    setReminders((prev) => [reminder, ...prev]);
    showToast(`Reminder saved for ${reminder.customerName}`);
  };

  const handleOpenReminderForCustomer = (cust: Customer) => {
    setPreselectedCustomer(cust);
    setActiveTab('reminders');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <KhataHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        onOpenPrivacyLab={() => setShowPrivacyLab(true)}
        onOpenPartnerModal={() => setShowPartnerModal(true)}
        onNewScan={() => setActiveTab('scanner')}
        isOllamaConnected={isOllamaConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <KhataScanner
            onApproveTransactions={handleApproveTransactions}
            isOllamaConnected={isOllamaConnected}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerLedger
            customers={customers}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onOpenReminderModal={handleOpenReminderForCustomer}
            onAddNewCustomer={handleAddNewCustomer}
            onReconcileCustomer={handleReconcileCustomer}
          />
        )}

        {activeTab === 'reminders' && (
          <PaymentReminders
            customers={customers}
            reminders={reminders}
            onUpdateReminderStatus={handleUpdateReminderStatus}
            onCreateReminder={handleCreateReminder}
            onRecordFullPayment={handleRecordFullPayment}
            preselectedCustomer={preselectedCustomer}
          />
        )}

        {activeTab === 'dashboard' && (
          <RecoveryDashboard
            metrics={metrics}
            customers={customers}
            transactions={transactions}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToReminders={() => setActiveTab('reminders')}
          />
        )}
      </main>

      {/* Privacy Lab Modal */}
      <PrivacyLabModal
        isOpen={showPrivacyLab}
        onClose={() => setShowPrivacyLab(false)}
        isOllamaConnected={isOllamaConnected}
        onRefreshOllama={() => {
          KhataAIService.checkOllamaHealth().then((res) => setIsOllamaConnected(res.running));
        }}
      />

      {/* 10x Partner Tech Showcase Modal */}
      <PartnerTechModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        isOllamaConnected={isOllamaConnected}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">KhataSnap AI</span>
            <span>•</span>
            <span>Built for DEV Challenge: Hacktoberfest Week 2 (Side Hustle)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Core: <strong>Gemma 2 / Local Open-Weights</strong></span>
            <span>•</span>
            <span>License: <strong>MIT Open Source</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
