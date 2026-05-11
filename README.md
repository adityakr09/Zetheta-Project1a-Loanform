# Multi-Step Loan Application Form
**Zetheta Algorithms | Full Stack Engineer Internship**

## What This Is
A production-grade, 8-step loan application form built in React.
Supports Personal, Home, and Business loan types with conditional flows.

## Tech Stack
- React 18 (no Redux — plain useState for state management)
- Vite (build tool)
- Plain CSS (no Tailwind, no UI library — all custom)
- localStorage for auto-save/resume
- HTML Canvas for e-signature
- No external form libraries — plain controlled components

## How to Run
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Project Structure
```
src/
├── App.jsx                  # Main app, step routing, auto-save
├── App.css                  # All styles
├── components/
│   ├── StepIndicator.jsx    # Progress bar at top
│   └── FormComponents.jsx   # Reusable Input, Select, NavButtons
├── steps/
│   ├── Step1_LoanType.jsx   # Loan type selection (Personal/Home/Business)
│   ├── Step2_PersonalDetails.jsx  # PAN, Aadhaar, address
│   ├── Step3_Employment.jsx # Employment/income (conditional for business)
│   ├── Step4_LoanDetails.jsx # Amount, purpose, tenure, EMI calculator
│   ├── Step5_Documents.jsx  # File upload with preview
│   ├── Step6_ESignature.jsx # Canvas e-signature
│   ├── Step7_Review.jsx     # Full summary with edit navigation
│   └── Step8_PreApproval.jsx # Eligibility result
└── utils/
    └── validators.js        # PAN/Aadhaar/phone validators + eligibility engine
```

## Features Built (Deliverables Mapping)

| Deliverable | Feature | File |
|---|---|---|
| Part 1 | 8-step architecture with useState state management | App.jsx |
| Part 2 | Conditional fields for Personal/Home/Business | Step3, Step4 |
| Part 3 | PAN/Aadhaar verification simulation + address autofill | Step2, validators.js |
| Part 4 | Document upload with image preview (FileReader API) | Step5 |
| Part 5 | Auto-save with localStorage + resume on return | App.jsx |
| Part 6 | EMI calculator + eligibility engine (income × multiplier + CIBIL) | Step4, Step8, validators.js |
| Part 7 | Review with per-section edit navigation | Step7 |
| Final | Full application submitted with docs | This repo |

## Eligibility Logic (validators.js)
- Max loan = monthlyIncome × multiplier (40x personal, 60x home, 50x business)
- CIBIL ≥ 750 → 8.5% rate | 700–749 → 10.5% | 650–699 → 12.5%
- CIBIL < 650 → rejected
- Income < ₹15,000 → rejected
- Standard EMI formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)

## Why No Fancy Libraries?
Fresher approach — everything built from scratch:
- No Formik/React Hook Form → plain useState + custom validate()
- No Yup/Zod → simple regex functions in validators.js
- No Redux → lifted state in App.jsx passed as props
- No UI library → custom CSS, easy to read and explain in interviews
