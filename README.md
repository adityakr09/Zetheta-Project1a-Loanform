# 🏦 LoanEase — Multi-Step Loan Application Form

> **Zetheta Algorithms | Full Stack Engineer Internship | Project 1A**

A production-grade, 8-step loan application form built with **React 18** — supporting Personal, Home, and Business loan types with real-world fintech features like PAN/Aadhaar verification, e-signature, document upload, and an eligibility engine.

---

## 📸 Screenshots

### Step 1 — Loan Type Selection
![Loan Type Selection](assets/Demo_1.png)

### Step 2 — Personal Details + PAN/Aadhaar Verification
![Personal Details](assets/Demo_2.png)

### Step 3 — Employment & Income Details
![Employment Details](assets/Demo_3.png)

### Step 4 — Loan Requirements + EMI Calculator
![Loan Details](assets/Demo_4.png)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔀 8-Step Flow | Loan Type → Personal → Employment → Loan → Docs → Sign → Review → Result |
| 🏠 3 Loan Types | Personal, Home, Business — each with conditional fields |
| 🪪 KYC Simulation | PAN & Aadhaar verification with simulated API + address autofill |
| 📎 Document Upload | File preview (images), type & size validation, per-loan required docs |
| ✍️ E-Signature | HTML Canvas — works on mouse and mobile touch |
| 💾 Auto-Save | localStorage — resume your application after closing the browser |
| 📊 EMI Calculator | Real-time indicative EMI preview with standard formula |
| 🧮 Eligibility Engine | Income × multiplier + CIBIL score → approval/rejection with reason |
| ✏️ Edit Navigation | Review page → click Edit on any section → jump directly back |
| 📱 Responsive | Works on mobile and desktop |

---

## 🛠️ Tech Stack

```
React 18          — UI (plain useState, no Redux)
Vite              — Build tool / dev server
Plain CSS         — All custom styles, no Tailwind
localStorage      — Auto-save / resume
HTML Canvas API   — E-signature pad
FileReader API    — Document preview
No form libraries — Custom validators only
```

> **Why no fancy libraries?**
> Everything is built from scratch — plain `useState`, custom `validate()` functions, manual regex checks.
> This makes the code easy to read, debug, and explain in interviews.

---

## 🚀 How to Run

```bash
# 1. Clone or extract the project
cd project1a

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
project1a/
├── index.html
├── package.json
├── vite.config.js
├── assets/                        ← Screenshots
│   ├── Demo_1.png
│   ├── Demo_2.png
│   ├── Demo_3.png
│   └── Demo_4.png
└── src/
    ├── App.jsx                    ← Step routing + auto-save logic
    ├── App.css                    ← All styles
    ├── main.jsx                   ← React entry point
    ├── components/
    │   ├── StepIndicator.jsx      ← Progress bar (8 steps)
    │   └── FormComponents.jsx     ← Reusable Input, Select, NavButtons
    ├── steps/
    │   ├── Step1_LoanType.jsx     ← Card-based loan type picker
    │   ├── Step2_PersonalDetails.jsx  ← PAN, Aadhaar, address
    │   ├── Step3_Employment.jsx   ← Conditional: salaried vs business
    │   ├── Step4_LoanDetails.jsx  ← Amount, purpose, tenure, EMI calc
    │   ├── Step5_Documents.jsx    ← Upload with preview
    │   ├── Step6_ESignature.jsx   ← Canvas signature pad
    │   ├── Step7_Review.jsx       ← Full summary + per-section edit
    │   └── Step8_PreApproval.jsx  ← Eligibility result + next steps
    └── utils/
        └── validators.js          ← PAN/Aadhaar/phone validators + EMI engine
```

---

## 🧮 Eligibility Logic

```js
// Max eligible amount
maxEligible = monthlyIncome × multiplier
// Personal → 40x | Home → 60x | Business → 50x

// Interest rate by CIBIL
score ≥ 750  →  8.5% p.a.   (Excellent)
score ≥ 700  →  10.5% p.a.  (Good)
score ≥ 650  →  12.5% p.a.  (Fair)
score < 650  →  Rejected

// EMI Formula (standard)
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
// P = principal | r = monthly rate | n = tenure in months
```

---

## 📋 Deliverables Mapping

| Part | Requirement | Implemented In |
|---|---|---|
| Part 1 | 8+ step architecture with state management | `App.jsx` |
| Part 2 | Conditional fields for all 3 loan types | `Step3`, `Step4` |
| Part 3 | PAN/Aadhaar verification + address autofill | `Step2`, `validators.js` |
| Part 4 | Document upload with preview + compression check | `Step5` |
| Part 5 | Auto-save + resume functionality | `App.jsx` → localStorage |
| Part 6 | Pre-approval summary + eligibility engine | `Step8`, `validators.js` |
| Part 7 | Cross-step validation + review with edit nav | `Step7` |
| Final | Production-grade submission with documentation | This repo |

---

## 👨‍💻 Author

**Aditya Kumar**
Python Developer | Backend Engineer | AI Application Developer
Bengaluru, Karnataka
[LinkedIn](#) · [GitHub](#)

---

> *Submitted as part of the Zetheta Algorithms Full Stack Engineer Internship Program — Project 1A (Days 1–15)*
