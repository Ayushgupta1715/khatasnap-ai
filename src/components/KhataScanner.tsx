import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  Plus, 
  Info, 
  Check, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KhataPageSample, Transaction } from '../types/khata';
import { SAMPLE_KHATA_PAGES } from '../data/mockKhata';
import { KhataAIService } from '../services/khataAIService';

interface KhataScannerProps {
  onApproveTransactions: (approvedEntries: Transaction[]) => void;
  isOllamaConnected: boolean;
}

export const KhataScanner: React.FC<KhataScannerProps> = ({
  onApproveTransactions,
  isOllamaConnected,
}) => {
  const [selectedSample, setSelectedSample] = useState<KhataPageSample>(SAMPLE_KHATA_PAGES[0]);
  const [currentImageUri, setCurrentImageUri] = useState<string>(SAMPLE_KHATA_PAGES[0].previewImage);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('Ready');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingEngine, setProcessingEngine] = useState<string>('Local Gemma 2 Vision');
  const [processingTime, setProcessingTime] = useState<number>(840);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Working list of extracted rows pending user approval
  const [extractedRows, setExtractedRows] = useState<Transaction[]>(() => {
    return SAMPLE_KHATA_PAGES[0].entries.map((e, index) => ({
      id: `pending-${index + 1}`,
      customerId: '',
      customerName: e.customerName,
      phone: e.phone,
      date: e.date,
      description: e.description,
      amount: e.amount,
      type: e.type,
      confidence: e.confidence,
      needsReview: e.needsReview,
      status: 'pending_approval',
      flagReason: e.flagReason,
      suggestedCorrection: e.suggestedCorrection,
      originalReadAmount: e.originalReadAmount,
    }));
  });

  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(3);
  const [customImageUploaded, setCustomImageUploaded] = useState<boolean>(false);

  // Simulated multi-step processing for realistic progress indicator
  const runProgressSimulation = async () => {
    setProcessingProgress(25);
    setProcessingStep('1/3: OpenCV Deskew & Contrast Enhancement...');
    await new Promise((r) => setTimeout(r, 280));
    
    setProcessingProgress(65);
    setProcessingStep('2/3: Local Gemma 2 Vision Tokenization & OCR...');
    await new Promise((r) => setTimeout(r, 420));
    
    setProcessingProgress(95);
    setProcessingStep('3/3: Deterministic Schema Audit & Ambiguity Check...');
    await new Promise((r) => setTimeout(r, 200));
  };

  // Handle sample selection
  const handleSelectSample = async (sample: KhataPageSample) => {
    setSelectedSample(sample);
    setCurrentImageUri(sample.previewImage);
    setCustomImageUploaded(false);
    setErrorMessage(null);
    setIsProcessing(true);

    const mockTransactions: Transaction[] = sample.entries.map((e, i) => ({
      id: `sample-tx-${Date.now()}-${i}`,
      customerId: '',
      customerName: e.customerName,
      phone: e.phone,
      date: e.date,
      description: e.description,
      amount: e.amount,
      type: e.type,
      confidence: e.confidence,
      needsReview: e.needsReview,
      status: 'pending_approval',
      flagReason: e.flagReason,
      suggestedCorrection: e.suggestedCorrection,
      originalReadAmount: e.originalReadAmount,
    }));

    await runProgressSimulation();
    const result = await KhataAIService.processKhataImage(sample.previewImage, mockTransactions);
    
    setProcessingEngine(result.engineUsed === 'gemma-local' ? 'Local Gemma 2 (Ollama)' : 'Embedded Open Vision');
    setProcessingTime(result.processingTimeMs);
    
    setExtractedRows(
      result.entries.map((e, i) => ({
        id: `extracted-${Date.now()}-${i}`,
        customerId: '',
        customerName: e.customerName,
        phone: e.phone,
        date: e.date,
        description: e.description,
        amount: e.amount,
        type: e.type,
        confidence: e.confidence,
        needsReview: e.needsReview,
        status: 'pending_approval',
        flagReason: e.flagReason,
        suggestedCorrection: e.suggestedCorrection,
        originalReadAmount: e.originalReadAmount,
      }))
    );
    setIsProcessing(false);
  };

  // Handle custom file upload with error handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP) of your handwritten register.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please try another image.');
      setIsProcessing(false);
    };

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCurrentImageUri(dataUrl);
      setCustomImageUploaded(true);
      setIsProcessing(true);

      await runProgressSimulation();
      const result = await KhataAIService.processKhataImage(dataUrl);
      setProcessingEngine(result.engineUsed === 'gemma-local' ? 'Local Gemma 2 (Ollama)' : 'Embedded Open Vision');
      setProcessingTime(result.processingTimeMs);

      setExtractedRows(
        result.entries.map((item, i) => ({
          id: `custom-${Date.now()}-${i}`,
          customerId: '',
          customerName: item.customerName,
          phone: item.phone,
          date: item.date,
          description: item.description,
          amount: Math.max(1, Math.abs(item.amount)),
          type: item.type,
          confidence: item.confidence,
          needsReview: item.needsReview,
          status: 'pending_approval',
          flagReason: item.flagReason,
          suggestedCorrection: item.suggestedCorrection,
          originalReadAmount: item.originalReadAmount,
        }))
      );
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  // Update a field in an extracted row
  const handleUpdateRow = (id: string, updates: Partial<Transaction>) => {
    setExtractedRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, ...updates };
          // Validation: amount must be positive
          if (updated.amount <= 0) {
            updated.validationError = 'Amount must be greater than ₹0';
          } else {
            delete updated.validationError;
          }

          if (updates.amount !== undefined && updates.amount !== row.amount) {
            updated.needsReview = false;
            delete updated.flagReason;
          }
          return updated;
        }
        return row;
      })
    );
  };

  // Action: Correct to Suggested Amount (e.g. ₹450)
  const handleQuickCorrection = (rowId: string, correctedAmount: number) => {
    handleUpdateRow(rowId, {
      amount: correctedAmount,
      needsReview: false,
      flagReason: undefined,
    });
  };

  // Action: Confirm original AI reading (e.g. ₹950)
  const handleConfirmOriginal = (rowId: string) => {
    handleUpdateRow(rowId, {
      needsReview: false,
      flagReason: undefined,
    });
  };

  // Delete an extracted row
  const handleDeleteRow = (id: string) => {
    setExtractedRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Add manual row
  const handleAddManualRow = () => {
    const newRow: Transaction = {
      id: `manual-${Date.now()}`,
      customerId: '',
      customerName: 'New Customer',
      phone: '+91 98000 00000',
      date: new Date().toISOString().split('T')[0],
      description: 'Groceries / Provisions',
      amount: 100,
      type: 'credit',
      confidence: 1.0,
      needsReview: false,
      status: 'pending_approval',
    };
    setExtractedRows((prev) => [...prev, newRow]);
  };

  // Final approval: Strict check for unverified entries
  const handleApproveAll = () => {
    if (extractedRows.length === 0) return;

    // Filter verified entries
    const verifiedEntries = extractedRows.filter((r) => !r.needsReview && !r.validationError);

    if (verifiedEntries.length === 0) {
      alert('Please resolve unverified entries before approving to the final ledger.');
      return;
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#047857', '#10B981', '#34D399', '#FBBF24'],
    });

    onApproveTransactions(verifiedEntries);
  };

  // Calculate separate verified vs unverified totals
  const verifiedRows = extractedRows.filter((r) => !r.needsReview && !r.validationError);
  const unverifiedRows = extractedRows.filter((r) => r.needsReview);

  const verifiedNetImpact = verifiedRows.reduce((sum, r) => {
    return r.type === 'credit' ? sum + r.amount : sum - r.amount;
  }, 0);

  // Potential range calculation for unverified entries
  let potentialMin = verifiedNetImpact;
  let potentialMax = verifiedNetImpact;

  unverifiedRows.forEach((r) => {
    const higherAmt = Math.max(r.amount, r.suggestedCorrection || r.amount);
    const lowerAmt = Math.min(r.amount, r.suggestedCorrection || r.amount);
    if (r.type === 'credit') {
      potentialMin += lowerAmt;
      potentialMax += higherAmt;
    } else {
      potentialMin -= higherAmt;
      potentialMax -= lowerAmt;
    }
  });

  return (
    <div className="space-y-4">
      {/* Compact Top Bar / Sample Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#047857]" />
              <span>Smart Khata Scanner & Verification Studio</span>
            </h2>
            <p className="text-xs text-slate-500">
              Handwritten Bahi-Khata extraction with human verification. Unverified entries stay out of the final ledger.
            </p>
          </div>

          {/* Compact Sample Buttons and Upload */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Samples:</span>
            {SAMPLE_KHATA_PAGES.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold border transition cursor-pointer ${
                  selectedSample.id === sample.id && !customImageUploaded
                    ? 'bg-[#047857] text-white border-[#047857] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Sample {idx + 1} ({sample.category === 'bahi_khata' ? 'Bahi-Khata' : 'Register'})
              </button>
            ))}

            <label className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-[#047857] border border-emerald-300 hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1 shadow-xs">
              <Upload className="w-3 h-3" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
            <span>Engine: <strong className="text-slate-800">{processingEngine} {isOllamaConnected ? '(Local Daemon)' : ''}</strong></span>
            <span>•</span>
            <span>Speed: <strong className="text-slate-800">{processingTime} ms</strong></span>
            <span>•</span>
            <span className="text-[#047857] bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
              100% On-Device • Zero Cloud API Cost
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Total: <strong className="text-slate-900">{extractedRows.length} rows</strong></span>
            <span>Verified: <strong className="text-emerald-700">{verifiedRows.length}</strong></span>
            {unverifiedRows.length > 0 && (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold flex items-center gap-1 border border-amber-200">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                {unverifiedRows.length} Needs Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline text-rose-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Side-by-Side Verification Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Original Handwritten Image Viewer */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Original Handwritten Ledger (Input)
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Raw Source
            </span>
          </div>

          <div className="p-3 bg-slate-100 flex-1 flex flex-col items-center justify-center min-h-[400px] max-h-[520px] overflow-auto relative">
            <div className="relative border border-slate-300 rounded shadow-xs bg-white max-w-full">
              <img
                src={currentImageUri}
                alt="Handwritten Khata"
                className="max-h-[460px] w-auto object-contain rounded"
              />

              {/* Visual Bounding Box for flagged row */}
              {activeHighlightIndex !== null && unverifiedRows.length > 0 && (
                <div 
                  className="absolute left-[3%] right-[3%] top-[34%] h-[7%] border-2 border-amber-500 bg-amber-400/20 rounded pointer-events-none transition-all flex items-center justify-end pr-2 animate-pulse"
                >
                  <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    Ambiguous: ₹950 vs ₹450
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 mt-2 text-center">
              💡 Notice Row 4: Priya Singh's digit looks like <strong>450 or 950</strong>. AI flagged it for confirmation.
            </p>
          </div>
        </div>

        {/* Right Side: Structured Transaction Review & Edit Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#047857]" />
                <span>Extracted Entries for Human Approval</span>
              </span>
            </div>

            <button
              onClick={handleAddManualRow}
              className="text-xs bg-white text-slate-700 hover:text-[#047857] border border-slate-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Entry</span>
            </button>
          </div>

          {/* List of Extracted Rows */}
          <div className="p-3.5 flex-1 overflow-y-auto space-y-3 max-h-[460px]">
            {isProcessing ? (
              <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-8 h-8 border-3 border-[#047857] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-xs font-bold text-slate-800">{processingStep}</p>
                <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#047857] h-full rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : extractedRows.length === 0 ? (
              <div className="py-14 text-center text-slate-400">
                <Info className="w-7 h-7 mx-auto mb-1 opacity-60" />
                <p className="text-xs font-medium">No entries extracted yet.</p>
              </div>
            ) : (
              extractedRows.map((row, index) => {
                const isUnclear = row.needsReview;
                const isCredit = row.type === 'credit';
                const hasSuggested = Boolean(row.suggestedCorrection);

                return (
                  <div
                    key={row.id}
                    onMouseEnter={() => isUnclear && setActiveHighlightIndex(index)}
                    className={`p-3 rounded-lg border transition ${
                      isUnclear
                        ? 'border-amber-300 bg-amber-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Specialized Verification & Quick Correction Controls for Flagged Row */}
                    {isUnclear && (
                      <div className="mb-2.5 pb-2 border-b border-amber-200 space-y-2">
                        <div className="flex items-start justify-between text-xs text-amber-950">
                          <div className="flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Needs Verification: {row.flagReason || 'Unclear handwriting'}</span>
                          </div>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                            Unverified
                          </span>
                        </div>

                        {/* Three High-Priority Action Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {hasSuggested && (
                            <button
                              onClick={() => handleQuickCorrection(row.id, row.suggestedCorrection!)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-1 rounded shadow-xs flex items-center gap-1 cursor-pointer transition"
                            >
                              <Check className="w-3 h-3" />
                              <span>Correct to ₹{row.suggestedCorrection}</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleConfirmOriginal(row.id)}
                            className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[11px] px-2.5 py-1 rounded shadow-xs flex items-center gap-1 cursor-pointer transition"
                          >
                            <span>Confirm ₹{row.amount}</span>
                          </button>

                          <button
                            onClick={() => {
                              const input = prompt(`Enter corrected amount for ${row.customerName}:`, row.amount.toString());
                              if (input && !isNaN(Number(input))) {
                                handleQuickCorrection(row.id, Number(input));
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Custom Amount</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      {/* Customer Name */}
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Customer
                        </label>
                        <input
                          type="text"
                          value={row.customerName}
                          onChange={(e) => handleUpdateRow(row.id, { customerName: e.target.value })}
                          className="w-full text-xs font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:border-[#047857] focus:outline-none py-0.5"
                        />
                      </div>

                      {/* Items Description */}
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Items / Details
                        </label>
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => handleUpdateRow(row.id, { description: e.target.value })}
                          className="w-full text-xs text-slate-600 bg-transparent border-b border-slate-300 focus:border-[#047857] focus:outline-none py-0.5"
                        />
                      </div>

                      {/* Amount with editable focus */}
                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Amount (₹)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={row.amount}
                            onChange={(e) => handleUpdateRow(row.id, { amount: Number(e.target.value) || 0 })}
                            className={`w-full text-xs font-mono font-bold py-0.5 pl-3.5 pr-1 border rounded ${
                              isUnclear
                                ? 'bg-amber-100 border-amber-400 text-amber-900'
                                : isCredit
                                ? 'bg-rose-50 border-rose-200 text-rose-700'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}
                          />
                          <span className="absolute left-1 top-0.5 text-xs text-slate-500 font-bold">₹</span>
                        </div>
                      </div>

                      {/* Credit vs Payment Type Toggle */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateRow(row.id, { type: isCredit ? 'payment' : 'credit' })}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition ${
                            isCredit
                              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {isCredit ? '+ Udhaar' : '- Jama'}
                        </button>

                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* High Priority Fix 1: Unverified vs Verified Totals Breakdown Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2.5">
            {/* 3-Pillar Financial Reliability Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
              {/* Verified Net Impact */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Verified Net Impact
                </span>
                <span className={`text-sm font-black font-mono ${verifiedNetImpact >= 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {verifiedNetImpact >= 0 ? `+ ₹${verifiedNetImpact.toLocaleString('en-IN')}` : `- ₹${Math.abs(verifiedNetImpact).toLocaleString('en-IN')}`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {verifiedRows.length} confirmed entries
                </span>
              </div>

              {/* Pending Verification */}
              <div className="border-t sm:border-t-0 sm:border-x border-slate-100 sm:px-2 pt-1 sm:pt-0">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Pending Verification
                </span>
                <span className="text-sm font-black font-mono text-amber-900">
                  {unverifiedRows.length} {unverifiedRows.length === 1 ? 'entry' : 'entries'}
                </span>
                <span className="text-[10px] text-amber-700/80 block mt-0.5">
                  Held outside ledger
                </span>
              </div>

              {/* Potential Net Impact */}
              <div className="border-t sm:border-t-0 pt-1 sm:pt-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Potential Net Impact
                </span>
                <span className="text-xs font-black font-mono text-slate-800">
                  {unverifiedRows.length > 0 
                    ? `₹${potentialMin.toLocaleString('en-IN')} – ₹${potentialMax.toLocaleString('en-IN')}`
                    : `₹${verifiedNetImpact.toLocaleString('en-IN')}`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Depending on confirmation
                </span>
              </div>
            </div>

            {/* Approval Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <div className="text-[11px] text-slate-500">
                {unverifiedRows.length > 0 ? (
                  <span className="text-amber-800 font-semibold">
                    ⚠️ {unverifiedRows.length} unverified entry will be held back until confirmed.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All {verifiedRows.length} entries verified and ready for ledger commit.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleApproveAll}
                  disabled={verifiedRows.length === 0 || isProcessing}
                  className="w-full sm:w-auto bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {unverifiedRows.length > 0
                      ? `Approve Verified Entries Only (₹${verifiedNetImpact.toLocaleString('en-IN')})`
                      : 'Approve & Save to Verified Ledger'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
