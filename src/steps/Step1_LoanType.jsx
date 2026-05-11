import { useState } from "react";
import { NavButtons } from "../components/FormComponents";

const LOAN_TYPES = [
  {
    value: "personal",
    label: "Personal Loan",
    icon: "👤",
    desc: "For personal expenses, travel, medical, education",
    maxAmount: "₹40 Lakhs",
    rate: "10.5% – 14%",
    tenure: "Up to 5 years",
  },
  {
    value: "home",
    label: "Home Loan",
    icon: "🏠",
    desc: "Purchase, construct or renovate your home",
    maxAmount: "₹5 Crores",
    rate: "8.5% – 11%",
    tenure: "Up to 20 years",
  },
  {
    value: "business",
    label: "Business Loan",
    icon: "🏢",
    desc: "Working capital, expansion, equipment purchase",
    maxAmount: "₹2 Crores",
    rate: "12% – 16%",
    tenure: "Up to 7 years",
  },
];

export default function LoanTypeSelector({ formData, updateFormData, goNext }) {
  const [selected, setSelected] = useState(formData.loanType || "");
  const [error, setError] = useState("");

  function handleSelect(value) {
    setSelected(value);
    setError("");
  }

  function handleNext() {
    if (!selected) {
      setError("Please select a loan type to continue.");
      return;
    }
    updateFormData({ loanType: selected });
    goNext();
  }

  return (
    <div className="step-wrapper">
      <h2 className="step-title">Select Loan Type</h2>
      <p className="step-subtitle">Choose the type of loan you want to apply for</p>

      <div className="loan-type-grid">
        {LOAN_TYPES.map((loan) => (
          <div
            key={loan.value}
            className={`loan-card ${selected === loan.value ? "loan-card-selected" : ""}`}
            onClick={() => handleSelect(loan.value)}
          >
            <div className="loan-icon">{loan.icon}</div>
            <h3 className="loan-name">{loan.label}</h3>
            <p className="loan-desc">{loan.desc}</p>
            <div className="loan-details">
              <div className="loan-detail-row">
                <span>Max Amount</span>
                <strong>{loan.maxAmount}</strong>
              </div>
              <div className="loan-detail-row">
                <span>Interest Rate</span>
                <strong>{loan.rate}</strong>
              </div>
              <div className="loan-detail-row">
                <span>Tenure</span>
                <strong>{loan.tenure}</strong>
              </div>
            </div>
            {selected === loan.value && (
              <div className="selected-badge">✓ Selected</div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="error-msg" style={{ textAlign: "center" }}>{error}</p>}

      <NavButtons onNext={handleNext} showBack={false} nextLabel="Continue →" />
    </div>
  );
}
