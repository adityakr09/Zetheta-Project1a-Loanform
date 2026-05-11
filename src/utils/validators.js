// Plain JS validation — no Yup, no Zod, just functions
// Fresher-grade: simple, readable, easy to explain in interviews

export function validatePAN(pan) {
  // PAN format: ABCDE1234F
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

export function validateAadhaar(aadhaar) {
  // 12 digit number
  const cleaned = aadhaar.replace(/\s/g, "");
  return /^\d{12}$/.test(cleaned);
}

export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePincode(pin) {
  return /^\d{6}$/.test(pin);
}

export function isEmpty(value) {
  return !value || value.toString().trim() === "";
}

// Simulate PAN verification (real app would call NSDL API)
export async function verifyPAN(pan) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (validatePAN(pan)) {
        resolve({ valid: true, name: "ADITYA KUMAR" });
      } else {
        resolve({ valid: false, name: null });
      }
    }, 1200); // simulate network delay
  });
}

// Simulate Aadhaar verification
export async function verifyAadhaar(aadhaar) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (validateAadhaar(aadhaar)) {
        resolve({
          valid: true,
          address: "123, MG Road, Bengaluru, Karnataka - 560001",
        });
      } else {
        resolve({ valid: false, address: null });
      }
    }, 1500);
  });
}

// Loan eligibility engine — simple rule-based (fresher level)
export function calculateEligibility(formData) {
  const { loanType, monthlyIncome, loanAmount, employmentType, cibilScore } = formData;

  const income = parseFloat(monthlyIncome) || 0;
  const amount = parseFloat(loanAmount) || 0;
  const score = parseInt(cibilScore) || 650;

  let maxEligible = 0;
  let interestRate = 0;
  let tenure = 0;
  let approved = false;
  let reason = "";

  // Basic rule: loan amount should not exceed 40x monthly income
  const incomeMultiplier = loanType === "home" ? 60 : loanType === "business" ? 50 : 40;
  maxEligible = income * incomeMultiplier;

  if (score < 650) {
    reason = "CIBIL score below minimum threshold (650)";
  } else if (amount > maxEligible) {
    reason = `Requested amount exceeds eligibility. Max: ₹${maxEligible.toLocaleString("en-IN")}`;
  } else if (income < 15000) {
    reason = "Monthly income below minimum requirement (₹15,000)";
  } else {
    approved = true;

    // Interest rate based on CIBIL
    if (score >= 750) interestRate = 8.5;
    else if (score >= 700) interestRate = 10.5;
    else interestRate = 12.5;

    // Tenure
    if (loanType === "home") tenure = 240; // 20 years
    else if (loanType === "business") tenure = 84; // 7 years
    else tenure = 60; // 5 years personal
  }

  // Calculate EMI (standard formula)
  let emi = 0;
  if (approved && amount > 0) {
    const r = interestRate / 100 / 12;
    const n = tenure;
    emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  return { approved, maxEligible, interestRate, tenure, emi, reason };
}
