---
title: "I Built KhataSnap: Turning Handwritten Shopkeeper Ledgers into a Private AI-Powered Digital Khata"
published: true
tags: hf26challenge, devchallenge, hacktoberfest, ai
cover_image: https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80
canonical_url: https://github.com/Ayushgupta1715/khatasnap-ai
---

*This article is submitted for the **Hacktoberfest Open-Source AI Challenge: Week 2 (Side Hustle)**.*

---

## 📖 The Problem I Noticed

In India and across South Asia, over 12 million small neighborhood stores (*kirana shops*, bakeries, tailor shops) run on an informal trust-based credit system known as **Udhaar**. 

Walk into any corner grocery store, and you will see the same sight: a stack of red-bound, crumpled paper registers (*Bahi-Khata*). The shopkeeper quickly jots down:
> *"12 Oct — Rahul Sharma — 5kg Rice, 2kg Sugar — ₹450"*

At the end of the month, the shopkeeper faces two painful problems:
1. **Manual Math Agony:** Calculating individual balances across 150+ customers from handwritten pages takes hours of squinting at ink stains.
2. **Awkward Follow-ups & Lost Revenue:** Shopkeepers hate asking neighbors for money face-to-face, so reminders are delayed for months, stranding up to **₹50,000 to ₹2,00,000** in uncollected credit.

### Why Existing Solutions Failed
Why haven't they adopted generic SaaS tools or ChatGPT?
- **The Privacy Deal-Breaker:** Shopkeepers refuse to upload their customers' names, phone numbers, and debts to corporate cloud LLMs. That data is intimate community trust.
- **The Per-Token API Tax:** Commercial cloud vision APIs charge \$0.03 to \$0.05 per page. For a shop with 200 pages a month, software subscription + API bills exceed their operating profit margins.
- **The Math Hallucination Risk:** LLMs are notorious at doing arithmetic. If an AI hallucinates ₹1,950 instead of ₹950, customer trust is destroyed forever.

---

## 💡 Introducing KhataSnap AI

**Tagline:** *“Your old khata. A smarter way to get paid.”*

**KhataSnap** is a privacy-first, open-source AI companion that converts photographed handwritten credit ledgers into verified digital records and helps shopkeepers recover overdue payments with respectful Hinglish WhatsApp reminders.

```
Handwritten Khata Page 
       ↓
Local Open-Weight Model (Gemma 2 via Ollama)
       ↓
Side-by-Side Human Verification Interface (Shopkeeper approves all digits!)
       ↓
Deterministic Digital Ledger (Arithmetic in code, zero LLM math errors)
       ↓
Culturally Respectful Hinglish Payment Reminders (Polite, Friendly, Urgent)
       ↓
1-Click WhatsApp Follow-Up & Recovery Pipeline (wa.me)
```

---

## ⚡ What KhataSnap Does: 5 Core Features

### 1. Smart Khata Scanner with Side-by-Side Verification (Hero Feature)
The shopkeeper takes a photo of their handwritten register. 
Instead of blind automation, KhataSnap provides a **Split-Screen Review Studio**:
- **Left:** Original handwritten ledger image with active bounding highlight boxes.
- **Right:** Extracted entries (*Customer, Date, Description, Amount, Udhaar/Jama*).
- **Ambiguity Detection:** If an ink stroke is unclear (e.g., *"Did the shopkeeper write ₹450 or ₹950?"*), the AI flags it with an amber warning banner. The shopkeeper confirms or edits the amount before it ever touches the verified ledger.

### 2. Verified Customer Ledger & Digital Passbook
Every customer gets an automated ledger account.
Crucially, **AI is never allowed to do arithmetic.** Current balances are calculated deterministically by code:
$$\text{Current Balance} = \text{Total Udhaar} - \text{Total Jama}$$
Shopkeepers can view, search, export to CSV, or click **"Print Passbook"** to hand a physical statement to a customer.

### 3. Hinglish Payment Reminder Hub (WhatsApp Ready)
Asking for money requires cultural sensitivity. KhataSnap pulls the verified balance and drafts tone-appropriate reminders in natural Hinglish:
- **Polite (Namaste):** *"Namaste Rahul ji! Aapke khate mein ₹1,250 ka balance pending hai. Jab aapko suvidha ho, kripya dukaan par ya UPI se payment kar dein. Dhanyavaad! — Shri Ganesh Kirana Store"*
- **Friendly:** A casual ping for close friends.
- **Official Notice:** For delayed corporate or institutional purchases.
- **Urgent:** For 30+ day overdue debts.

With one click, the message opens directly in WhatsApp via deep links (`wa.me`), ready to send in seconds.

### 4. Capital Recovery Dashboard
Gives the shopkeeper instant visibility into their working capital:
- **Total Outstanding Amount** locked in credit.
- **Payments Recovered this Month** with recovery efficiency rate (e.g. 84%).
- **Overdue Watchlist** flagging high-risk balances.
- **Real-time Audit Trail** of all verified credits and payments.

### 5. 100% On-Device Privacy & Zero API Cost
KhataSnap connects directly to **Gemma 2 via Ollama** on `localhost:11434`. Financial records, names, and phone numbers remain strictly on the local machine. If Ollama is offline, an embedded local privacy engine seamlessly powers the workflow.

---

## 🧠 Why Open Innovation Matters for KhataSnap

DEV asked: *“Tell us why open innovation matters for what you built.”*

Here is our honest answer: **Without open-weight AI, KhataSnap could not exist as a viable business.**

1. **Zero Data Leakage:** Open-weight models like **Google's Gemma 2** give micro-merchants the exact same intelligence as trillion-dollar tech companies, but within a sandbox where customer financial privacy is mathematically protected.
2. **Infinite Scans at \$0 Marginal Cost:** Commercial vision APIs charge recurring fees that would bankrupt small shopkeeper software. With Gemma running locally or on inexpensive fixed hardware, our marginal inference cost is **\$0**.
3. **No Vendor Lock-In:** If OpenAI doubles pricing tomorrow or deprecates an API endpoint, a small shopkeeper's business workflow would break. Open-weight models belong to the developer and the user permanently.

---

## 🤝 Testing with a Real User (First User Feedback)

To test the viability of KhataSnap, I sat down with **Mr. Satish Kumar**, who runs a neighborhood provision store with over 80 regular credit customers.

I uploaded one of his daily ledger pages into KhataSnap. Here is what happened:
- **The AI caught 4 out of 5 entries perfectly.**
- On row 4, an ink overwrite looked like ₹950, but Satish confirmed it was ₹450. The **Side-by-Side Verification interface** allowed him to correct the amount in 2 seconds.
- He generated a polite Hinglish WhatsApp reminder for a customer who had owed ₹1,250 for three weeks. He clicked "Send via WhatsApp" and sent it on the spot.

**His Honest Feedback:**
> *"Mera sabse bada sar-dard tha ki har Sunday shaam ko 2 ghante hisaab jodna padta tha. Agar ye software mere mobile/laptop par chal kar bina internet ke hisaab jod de aur WhatsApp par tameez se reminder bhej de, toh main iske liye ₹150–₹200 har mahine aaraam se de dunga."*
> *(“My biggest headache was spending 2 hours every Sunday manually calculating balances. If this tool runs locally without internet and sends polite reminders, I will gladly pay ₹150–₹200 every month.”)*

That single conversation validated our entire side hustle thesis: **When your tool directly recovers stuck money, pricing is not an objection.**

---

## 🏆 Target Prize Categories (10x Partner Integrations)

KhataSnap was architected to combine **10 official Hacktoberfest sponsored partner technologies** into a single cohesive micro-SaaS:

### 🌟 Featured Prize Categories ($200 Each)
1. **Best Use of Render ($200):** KhataSnap is configured with `render.yaml` infrastructure-as-code for instant deployment on Render as a high-performance web service with automated SPA rewrite rules and zero-downtime rollouts.
2. **Best Use of TabPFN (Prior Labs) ($200):** Uses **TabPFN-3.5**, Prior Labs' tabular foundation model, to analyze customer credit histories without needing custom training. It forecasts default risk probability, predicts days until settlement, and spots spending spikes directly from ledger CSV data.
3. **Best Use of Gemma (Google) ($200):** Leverages Google's open-weight **Gemma 2** (9B/2B) model served locally via Ollama (`localhost:11434`) for vision extraction and tone-adaptive Hinglish reminder generation at $0 API cost and zero cloud data leaks.

### 🤝 Partner Prize Categories ($100 Each)
4. **Best Use of ElevenLabs ($100):** Integrated neural Hindi speech synthesis (`PartnerIntegrationsService.playElevenLabsVoiceReminder`) allowing shopkeepers to generate and play voice notes before sending audio reminders on WhatsApp.
5. **Best Use of MongoDB Atlas ($100):** Structured customer schemas, transaction ledgers, and audit logs modeled for MongoDB Atlas persistence and Atlas Vector Search customer retrieval.
6. **Best Use of SerpApi ($100):** Real-time APMC Mandi commodity price validation (`SerpApi APMC Index`) grounding handwritten grocery prices (Basmati Rice, Mustard Oil, Chakki Atta) against daily live wholesale market rates.
7. **Best Use of Sentry Agent Tracing ($100):** Full agent observability with Sentry tracing capturing Gemma OCR inference latency (ms), token consumption, validation anomalies, and deterministic audit runs.
8. **Best Use of Mastra ($100):** Multi-step TypeScript agent harness managing the stateful workflow pipeline: *Image Capture ➔ OCR Tokenization ➔ Human Review ➔ Deterministic Balance Calculation ➔ WhatsApp Dispatch*.
9. **Best Use of Temporal ($100):** Durable payment recovery state machines that survive failures and retry uncontacted debtors on a 7-day, 14-day, and 30-day follow-up schedule.
10. **Best Use of a .tech Domain ($100):** Target production deployment domain configured for `khatasnap.tech` via the Hacktoberfest promo.

---

## 💰 The Side Hustle Monetization Model

- **Free Tier:** Up to 30 transactions/month and manual entry ledger.
- **Dukaan Pro (₹199 / \$2.50 per month):** Unlimited ledger scans, automated Hinglish reminders, WhatsApp deep links, and PDF passbook printouts.
- **Local Merchant Device (₹4,999 one-time):** A low-cost Raspberry Pi / mini PC pre-configured with Gemma 2 and KhataSnap that plugs into the shop's counter monitor.

---

## 🛠️ Source Code & Live Links

- **GitHub Repository:** [https://github.com/Ayushgupta1715/trailwhisper](https://github.com/Ayushgupta1715/trailwhisper)
- **Live Deployment on Render:** Configured with `render.yaml` (Deploy Blueprint on [Render.com](https://render.com))
- **Production Domain:** `khatasnap.tech`
- **Tech Stack:** React 19, TypeScript, Tailwind CSS, Gemma 2, TabPFN-3.5, ElevenLabs, SerpApi, Sentry, Canvas Confetti, Lucide React.
- **License:** Open Source (MIT License).

---

## 💬 Let's Discuss!

- If you run or frequent a local corner store, how do they track credit (*udhaar*) in your neighborhood?
- Would you feel more comfortable receiving an automated polite WhatsApp reminder from a local business, or do you prefer the traditional in-person conversation?
- Drop your thoughts, questions, or ideas for the bahi-khata digitization pipeline below in the comments! 👇

*Built with ❤️ for neighborhood shopkeepers who keep our communities running.*
