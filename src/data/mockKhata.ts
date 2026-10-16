import { Customer, KhataPageSample, PaymentReminder, Transaction } from '../types/khata';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address: 'Shop No. 4, Main Bazaar',
    openingBalance: 1000,
    totalCredit: 450,
    totalPaid: 200,
    currentBalance: 1450, // Intentional simulated discrepancy of ₹200 for smart reconciliation demo
    expectedBalance: 1250, // 1000 + 450 - 200 = 1250
    hasDiscrepancy: true,
    discrepancyNote: 'Discrepancy Detected: Opening ₹1,000 + New Credit ₹450 - Payment ₹200 = Expected ₹1,250. Recorded balance is ₹1,450 (+₹200 manual mismatch).',
    lastTransactionDate: '2026-10-14',
    risk: 'moderate',
    notes: 'Regular customer. Pays weekly on Saturday.',
  },
  {
    id: 'cust-2',
    name: 'Amit Verma',
    phone: '+91 98123 45678',
    address: 'House #12, Railway Colony',
    totalCredit: 3850,
    totalPaid: 1500,
    currentBalance: 2350,
    lastTransactionDate: '2026-10-13',
    risk: 'high',
    notes: 'Pending for over 3 weeks. Needs gentle reminder.',
  },
  {
    id: 'cust-3',
    name: 'Priya Singh',
    phone: '+91 97234 56789',
    address: 'Flat 302, Green Valley Apts',
    totalCredit: 1680,
    totalPaid: 1000,
    currentBalance: 680,
    lastTransactionDate: '2026-10-15',
    risk: 'low',
    notes: 'Always settles via UPI after monthly salary.',
  },
  {
    id: 'cust-4',
    name: 'Vikram Patel',
    phone: '+91 99345 67890',
    address: 'Near Old Bus Stand',
    totalCredit: 2100,
    totalPaid: 1800,
    currentBalance: 300,
    lastTransactionDate: '2026-10-11',
    risk: 'low',
    notes: 'Long-time patron.',
  },
  {
    id: 'cust-5',
    name: 'Sunita Devi',
    phone: '+91 98456 78901',
    address: 'Street 5, Gandhi Nagar',
    totalCredit: 1950,
    totalPaid: 500,
    currentBalance: 1450,
    lastTransactionDate: '2026-10-10',
    risk: 'moderate',
    notes: 'Daily dairy & ration customer.',
  },
  {
    id: 'cust-6',
    name: 'Rajesh Gupta',
    phone: '+91 98567 89012',
    address: 'Gupta Sweets, Chowk',
    totalCredit: 5200,
    totalPaid: 5200,
    currentBalance: 0,
    lastTransactionDate: '2026-10-09',
    risk: 'low',
    notes: 'Account fully cleared!',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    date: '2026-10-12',
    description: 'Basmati Rice (5kg), Sugar (2kg)',
    amount: 450,
    type: 'credit',
    confidence: 0.96,
    needsReview: false,
    status: 'verified',
  },
  {
    id: 'tx-2',
    customerId: 'cust-2',
    customerName: 'Amit Verma',
    phone: '+91 98123 45678',
    date: '2026-10-13',
    description: 'Mustard Oil (1L), Fortune Atta (5kg)',
    amount: 300,
    type: 'credit',
    confidence: 0.93,
    needsReview: false,
    status: 'verified',
  },
  {
    id: 'tx-3',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    date: '2026-10-14',
    description: 'Cash payment received (Part settlement)',
    amount: 200,
    type: 'payment',
    confidence: 0.98,
    needsReview: false,
    status: 'verified',
  },
  {
    id: 'tx-4',
    customerId: 'cust-3',
    customerName: 'Priya Singh',
    phone: '+91 97234 56789',
    date: '2026-10-15',
    description: 'MDH Garam Masala, Tata Tea Gold, Amul Milk',
    amount: 680,
    type: 'credit',
    confidence: 0.94,
    needsReview: false,
    status: 'verified',
  },
  {
    id: 'tx-5',
    customerId: 'cust-5',
    customerName: 'Sunita Devi',
    phone: '+91 98456 78901',
    date: '2026-10-10',
    description: 'Ration items (Daal, Chana, Ghee)',
    amount: 1450,
    type: 'credit',
    confidence: 0.91,
    needsReview: false,
    status: 'verified',
  },
];

export const INITIAL_REMINDERS: PaymentReminder[] = [
  {
    id: 'rem-1',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    pendingAmount: 1250,
    messageText: 'Namaste Rahul ji! Aapke khate mein ₹1,250 ka balance pending hai. Jab aapko suvidha ho, kripya dukaan par ya UPI se payment kar dein. Dhanyavaad! — Shri Ganesh Kirana Store',
    tone: 'polite',
    status: 'reminder_prepared',
    createdAt: '2026-10-14 11:30 AM',
  },
  {
    id: 'rem-2',
    customerId: 'cust-2',
    customerName: 'Amit Verma',
    phone: '+91 98123 45678',
    pendingAmount: 2350,
    messageText: 'Hello Amit ji, aapse nivedan hai ki pichhle mahine ka ₹2,350 ka udhaar hisaab clear kar lijiye taaki naya samaan bill karne me aasaani rahe. Shukriya!',
    tone: 'formal',
    status: 'contacted',
    createdAt: '2026-10-13 04:15 PM',
    lastSentAt: '2026-10-13 04:20 PM',
  },
  {
    id: 'rem-3',
    customerId: 'cust-3',
    customerName: 'Priya Singh',
    phone: '+91 97234 56789',
    pendingAmount: 680,
    messageText: 'Hi Priya ji! Aapka ₹680 ka balance due hai. Jab bhi free hon, UPI par transfer kar dijiye. Dhanyawad!',
    tone: 'friendly',
    status: 'not_contacted',
    createdAt: '2026-10-15 09:00 AM',
  },
];

// SVG Realistic Handwritten Khata Mock Page 1
const SAMPLE_PAGE_1_SVG = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850" width="700" height="850">
  <defs>
    <filter id="paper-texture">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
      <feDiffuseLighting in="noise" lighting-color="#fff8eb" surfaceScale="1">
        <feDistantLight azimuth="45" elevation="60" />
      </feDiffuseLighting>
      <feBlend mode="multiply" in="SourceGraphic" />
    </filter>
  </defs>
  
  <!-- Aged ledger background -->
  <rect width="100%" height="100%" fill="#FAF6EC"/>
  
  <!-- Notebook lines -->
  <line x1="90" y1="0" x2="90" y2="850" stroke="#f43f5e" stroke-width="1.5" stroke-opacity="0.75"/>
  <line x1="94" y1="0" x2="94" y2="850" stroke="#f43f5e" stroke-width="1" stroke-opacity="0.4"/>
  
  <line x1="0" y1="90" x2="700" y2="90" stroke="#f43f5e" stroke-width="1.5" stroke-opacity="0.6"/>
  
  <!-- Ruled horizontal blue lines -->
  <g stroke="#93c5fd" stroke-width="1" stroke-opacity="0.55">
    <line x1="0" y1="140" x2="700" y2="140" />
    <line x1="0" y1="190" x2="700" y2="190" />
    <line x1="0" y1="240" x2="700" y2="240" />
    <line x1="0" y1="290" x2="700" y2="290" />
    <line x1="0" y1="340" x2="700" y2="340" />
    <line x1="0" y1="390" x2="700" y2="390" />
    <line x1="0" y1="440" x2="700" y2="440" />
    <line x1="0" y1="490" x2="700" y2="490" />
    <line x1="0" y1="540" x2="700" y2="540" />
    <line x1="0" y1="590" x2="700" y2="590" />
    <line x1="0" y1="640" x2="700" y2="640" />
    <line x1="0" y1="690" x2="700" y2="690" />
    <line x1="0" y1="740" x2="700" y2="740" />
  </g>
  
  <!-- Header Stamp -->
  <text x="350" y="55" font-family="'Caveat', cursive, serif" font-size="28" font-weight="bold" fill="#881337" text-anchor="middle">
    ॥ श्री गणेशाय नमः ॥ दैनिक उधारी बही (October 2026)
  </text>
  <text x="590" y="78" font-family="'Caveat', cursive" font-size="16" fill="#1e3a8a">पृष्ठ संख्या: 28</text>

  <!-- Table Headers -->
  <text x="35" y="125" font-family="'Caveat', cursive" font-size="20" font-weight="bold" fill="#0f172a">तारीख</text>
  <text x="120" y="125" font-family="'Caveat', cursive" font-size="20" font-weight="bold" fill="#0f172a">ग्राहक का नाम</text>
  <text x="320" y="125" font-family="'Caveat', cursive" font-size="20" font-weight="bold" fill="#0f172a">सामान का विवरण</text>
  <text x="560" y="125" font-family="'Caveat', cursive" font-size="20" font-weight="bold" fill="#0f172a">रकम (₹)</text>

  <!-- Handwritten Row 1 -->
  <g transform="rotate(-0.5 100 170)">
    <text x="25" y="175" font-family="'Caveat', cursive" font-size="22" fill="#1e3a8a">12 Oct</text>
    <text x="115" y="175" font-family="'Caveat', cursive" font-size="23" font-weight="bold" fill="#0284c7">Rahul Sharma</text>
    <text x="310" y="175" font-family="'Caveat', cursive" font-size="21" fill="#1e293b">Rice 5kg, Sugar 2kg</text>
    <text x="560" y="175" font-family="'Caveat', cursive" font-size="25" font-weight="bold" fill="#dc2626">₹ 450 /-</text>
  </g>

  <!-- Handwritten Row 2 -->
  <g transform="rotate(0.6 100 220)">
    <text x="25" y="225" font-family="'Caveat', cursive" font-size="22" fill="#1e3a8a">13 Oct</text>
    <text x="115" y="225" font-family="'Caveat', cursive" font-size="23" font-weight="bold" fill="#0284c7">Amit Verma</text>
    <text x="310" y="225" font-family="'Caveat', cursive" font-size="21" fill="#1e293b">Oil 1L, Atta 5kg</text>
    <text x="560" y="225" font-family="'Caveat', cursive" font-size="25" font-weight="bold" fill="#dc2626">₹ 300 /-</text>
  </g>

  <!-- Handwritten Row 3: Payment Entry (Jama) -->
  <g transform="rotate(-0.3 100 270)">
    <text x="25" y="275" font-family="'Caveat', cursive" font-size="22" fill="#1e3a8a">14 Oct</text>
    <text x="115" y="275" font-family="'Caveat', cursive" font-size="23" font-weight="bold" fill="#0284c7">Rahul Sharma</text>
    <text x="310" y="275" font-family="'Caveat', cursive" font-size="21" fill="#15803d">रोकड़ जमा (Cash Paid)</text>
    <text x="560" y="275" font-family="'Caveat', cursive" font-size="25" font-weight="bold" fill="#15803d">- ₹ 200 /-</text>
  </g>

  <!-- Handwritten Row 4: Ambiguous Digit Row (Needs Review!) -->
  <g transform="rotate(0.4 100 320)">
    <text x="25" y="325" font-family="'Caveat', cursive" font-size="22" fill="#1e3a8a">15 Oct</text>
    <text x="115" y="325" font-family="'Caveat', cursive" font-size="23" font-weight="bold" fill="#0284c7">Priya Singh</text>
    <text x="310" y="325" font-family="'Caveat', cursive" font-size="21" fill="#1e293b">Masala, Tea Gold, Milk</text>
    <!-- Overwritten digit that looks like 450 or 950 -->
    <text x="560" y="325" font-family="'Caveat', cursive" font-size="26" font-weight="bold" fill="#b45309" text-decoration="underline">₹ 950?</text>
    <circle cx="590" cy="318" r="18" fill="none" stroke="#d97706" stroke-width="1.8" stroke-dasharray="3,3"/>
  </g>

  <!-- Handwritten Row 5 -->
  <g transform="rotate(-0.4 100 370)">
    <text x="25" y="375" font-family="'Caveat', cursive" font-size="22" fill="#1e3a8a">15 Oct</text>
    <text x="115" y="375" font-family="'Caveat', cursive" font-size="23" font-weight="bold" fill="#0284c7">Vikram Patel</text>
    <text x="310" y="375" font-family="'Caveat', cursive" font-size="21" fill="#1e293b">Vim Bar, Rin, Parle-G</text>
    <text x="560" y="375" font-family="'Caveat', cursive" font-size="25" font-weight="bold" fill="#dc2626">₹ 180 /-</text>
  </g>

  <!-- Dukaandar signature / Stamp bottom -->
  <g transform="translate(480, 760)">
    <rect x="0" y="0" width="180" height="60" fill="none" stroke="#dc2626" stroke-width="2" rx="4" stroke-opacity="0.6"/>
    <text x="90" y="26" font-family="'Caveat', cursive" font-size="16" fill="#dc2626" font-weight="bold" text-anchor="middle">श्री गणेश किराना स्टोर</text>
    <text x="90" y="48" font-family="'Caveat', cursive" font-size="14" fill="#dc2626" text-anchor="middle">हस्ताक्षर: सतीश कुमार</text>
  </g>
</svg>
`);

export const SAMPLE_KHATA_PAGES: KhataPageSample[] = [
  {
    id: 'sample-page-1',
    title: 'Bahi-Khata Register Page 28',
    subTitle: 'Traditional Kirana red-margin ledger with 5 daily credit & payment entries',
    category: 'bahi_khata',
    previewImage: SAMPLE_PAGE_1_SVG,
    entries: [
      {
        customerName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        date: '2026-10-12',
        description: 'Rice (5kg), Sugar (2kg)',
        amount: 450,
        type: 'credit',
        confidence: 0.96,
        needsReview: false,
      },
      {
        customerName: 'Amit Verma',
        phone: '+91 98123 45678',
        date: '2026-10-13',
        description: 'Oil (1L), Atta (5kg)',
        amount: 300,
        type: 'credit',
        confidence: 0.92,
        needsReview: false,
      },
      {
        customerName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        date: '2026-10-14',
        description: 'Cash payment received (Part settlement)',
        amount: 200,
        type: 'payment',
        confidence: 0.98,
        needsReview: false,
      },
      {
        customerName: 'Priya Singh',
        phone: '+91 97234 56789',
        date: '2026-10-15',
        description: 'Masala, Tea Gold, Milk',
        amount: 950, // Ambiguous handwritten digit (450 vs 950)
        type: 'credit',
        confidence: 0.68,
        needsReview: true,
        suggestedCorrection: 450,
        originalReadAmount: 950,
        flagReason: 'Unclear handwritten digit: "950" might be "450". Please verify!',
      },
      {
        customerName: 'Vikram Patel',
        phone: '+91 99345 67890',
        date: '2026-10-15',
        description: 'Vim Bar, Rin Soap, Parle-G',
        amount: 180,
        type: 'credit',
        confidence: 0.95,
        needsReview: false,
      },
    ],
  },
  {
    id: 'sample-page-2',
    title: 'Weekly Udhaar Register - Sheet 14',
    subTitle: 'Ruled notebook with strikethrough correction & multiple dairy credits',
    category: 'ruled_register',
    previewImage: SAMPLE_PAGE_1_SVG,
    entries: [
      {
        customerName: 'Sunita Devi',
        phone: '+91 98456 78901',
        date: '2026-10-10',
        description: 'Desi Ghee (500g), Chana Daal (2kg)',
        amount: 540,
        type: 'credit',
        confidence: 0.91,
        needsReview: false,
      },
      {
        customerName: 'Rajesh Gupta',
        phone: '+91 98567 89012',
        date: '2026-10-11',
        description: 'UPI Payment received via QR Code',
        amount: 1200,
        type: 'payment',
        confidence: 0.97,
        needsReview: false,
      },
      {
        customerName: 'Amit Verma',
        phone: '+91 98123 45678',
        date: '2026-10-12',
        description: 'Refined Oil (2L), Surf Excel',
        amount: 620,
        type: 'credit',
        confidence: 0.74,
        needsReview: true,
        suggestedCorrection: 520,
        originalReadAmount: 620,
        flagReason: 'Overwriting detected on amount ₹620 (corrected from ₹520).',
      },
    ],
  },
];
