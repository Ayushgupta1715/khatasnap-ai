export type TransactionType = 'credit' | 'payment';

export type TransactionStatus = 'verified' | 'pending_approval' | 'rejected';

export type ReminderStatus = 
  | 'not_contacted' 
  | 'reminder_prepared' 
  | 'contacted' 
  | 'partially_paid' 
  | 'paid' 
  | 'disputed';

export type ReminderTone = 'polite' | 'friendly' | 'formal' | 'urgent';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  phone?: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType; // 'credit' = Udhaar (due), 'payment' = Jama (paid)
  confidence: number;
  needsReview: boolean;
  status: TransactionStatus;
  scanBatchId?: string;
  originalRawText?: string;
  notes?: string;
  flagReason?: string;
  suggestedCorrection?: number; // E.g. 450 when read as 950
  originalReadAmount?: number; // E.g. 950
  validationError?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  openingBalance?: number;
  totalCredit: number;
  totalPaid: number;
  currentBalance: number; // Always mathematically computed: totalCredit - totalPaid
  lastTransactionDate: string;
  risk: 'low' | 'moderate' | 'high';
  notes?: string;
  hasDiscrepancy?: boolean;
  expectedBalance?: number;
  recordedBalance?: number;
  discrepancyNote?: string;
}

export interface PaymentReminder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  pendingAmount: number;
  messageText: string;
  tone: ReminderTone;
  status: ReminderStatus;
  createdAt: string;
  lastSentAt?: string;
}

export interface KhataPageSample {
  id: string;
  title: string;
  subTitle: string;
  category: 'bahi_khata' | 'ruled_register' | 'daily_slip';
  previewImage: string;
  entries: {
    customerName: string;
    phone: string;
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    confidence: number;
    needsReview: boolean;
    flagReason?: string;
    suggestedCorrection?: number;
    originalReadAmount?: number;
  }[];
}

export interface ScanBatchResult {
  id: string;
  uploadedAt: string;
  imagePreview: string;
  fileName: string;
  totalEntries: number;
  needsReviewCount: number;
  approvedCount: number;
  entries: Transaction[];
}

export interface DashboardMetrics {
  totalOutstanding: number;
  customersWithPending: number;
  paymentsReceivedThisMonth: number;
  recordsNeedingVerification: number;
  totalCustomers: number;
  totalRemindersPending: number;
}
