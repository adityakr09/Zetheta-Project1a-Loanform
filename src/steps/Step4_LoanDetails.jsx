import { useState } from "react";
import { FormInput, FormSelect, NavButtons } from "../components/FormComponents";
import { isEmpty } from "../utils/validators";

export default function LoanDetails({ formData, updateFormData, goNext, goBack }) {
  const loanType = formData.loanType;

  const [fields, setFields] = useState({
    loanAmount: formData.loanAmount || "",
    loanPurpose: formData.loanPurpose || "",
    preferredTenure: formData.preferredTenure || "",
    propertyLocation: formData.propertyLocation || "",
    propertyValue: formData.propertyValue || "",
    existingLoans: formData.existingLoans || "no",
    existingEMI: formData.existingEMI || "",
  });

  const [errors, setErrors] = useState({});
  const [emiPreview, setEmiPreview] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setEmiPreview(null);
  }

  // EMI preview calculator
  function calculateEMIPreview() {
    const amount = parseFloat(fields.loanAmount);
    const months = parseInt(fields.preferredTenure);
    const rate = loanType === "home" ? 9 : loanType === "business" ? 14 : 12;
    if (!amount || !months) return;

    const r = rate / 100 / 12;
    const emi = Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    setEmiPreview({ emi, rate, months });
  }

  function validate() {
    const newErrors = {};
    if (isEmpty(fields.loanAmount) || parseFloat(fields.loanAmount) <= 0) newErrors.loanAmount = "Enter a valid loan amount";
    if (isEmpty(fields.loanPurpose)) newErrors.loanPurpose = "Loan purpose is required";
    if (isEmpty(fields.preferredTenure)) newErrors.preferredTenure = "Select preferred tenure";
    if (loanType === "home") {
      if (isEmpty(fields.propertyLocation)) newErrors.propertyLocation = "Property location required for home loan";
      if (isEmpty(fields.propertyValue)) newErrors.propertyValue = "Property value required";
    }
    if (fields.existingLoans === "yes" && isEmpty(fields.existingEMI)) {
      newErrors.existingEMI = "Enter current EMI amount";
    }
    return newErrors;
  }

  function handleNext() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    updateFormData(fields);
    goNext();
  }

  // Tenure options differ by loan type
  const tenureOptions = {
    personal: [
      { value: "12", label: "1 Year" }, { value: "24", label: "2 Years" },
      { value: "36", label: "3 Years" }, { value: "48", label: "4 Years" },
      { value: "60", label: "5 Years" },
    ],
    home: [
      { value: "60", label: "5 Years" }, { value: "120", label: "10 Years" },
      { value: "180", label: "15 Years" }, { value: "240", label: "20 Years" },
    ],
    business: [
      { value: "12", label: "1 Year" }, { value: "24", label: "2 Years" },
      { value: "36", label: "3 Years" }, { value: "60", label: "5 Years" },
      { value: "84", label: "7 Years" },
    ],
  };

  const purposeOptions = {
    personal: [
      { value: "medical", label: "Medical Emergency" },
      { value: "travel", label: "Travel / Vacation" },
      { value: "education", label: "Education" },
      { value: "wedding", label: "Wedding Expenses" },
      { value: "home-renovation", label: "Home Renovation" },
      { value: "debt-consolidation", label: "Debt Consolidation" },
      { value: "other", label: "Other" },
    ],
    home: [
      { value: "purchase", label: "Property Purchase" },
      { value: "construction", label: "Construction" },
      { value: "renovation", label: "Renovation / Extension" },
      { value: "balance-transfer", label: "Balance Transfer" },
    ],
    business: [
      { value: "working-capital", label: "Working Capital" },
      { value: "equipment", label: "Equipment Purchase" },
      { value: "expansion", label: "Business Expansion" },
      { value: "inventory", label: "Inventory Purchase" },
      { value: "other", label: "Other" },
    ],
  };

  return (
    <div className="step-wrapper">
      <h2 className="step-title">Loan Requirements</h2>
      <p className="step-subtitle">Tell us how much you need and for how long</p>

      <div className="form-grid">
        <FormInput
          label="Loan Amount (₹)"
          name="loanAmount"
          type="number"
          value={fields.loanAmount}
          onChange={handleChange}
          error={errors.loanAmount}
          required
          placeholder={loanType === "home" ? "eg: 5000000" : "eg: 500000"}
        />
        <FormSelect
          label="Loan Purpose"
          name="loanPurpose"
          value={fields.loanPurpose}
          onChange={handleChange}
          error={errors.loanPurpose}
          required
          options={purposeOptions[loanType] || purposeOptions.personal}
        />
        <FormSelect
          label="Preferred Tenure"
          name="preferredTenure"
          value={fields.preferredTenure}
          onChange={handleChange}
          error={errors.preferredTenure}
          required
          options={tenureOptions[loanType] || tenureOptions.personal}
        />
      </div>

      {/* Home loan extra fields */}
      {loanType === "home" && (
        <div className="conditional-section">
          <h3 className="section-heading">Property Details</h3>
          <div className="form-grid">
            <FormInput label="Property Location / Address" name="propertyLocation" value={fields.propertyLocation} onChange={handleChange} error={errors.propertyLocation} required />
            <FormInput label="Estimated Property Value (₹)" name="propertyValue" type="number" value={fields.propertyValue} onChange={handleChange} error={errors.propertyValue} required />
          </div>
        </div>
      )}

      {/* Existing loans */}
      <div className="conditional-section">
        <h3 className="section-heading">Existing Financial Obligations</h3>
        <FormSelect
          label="Do you have any existing loans / EMIs?"
          name="existingLoans"
          value={fields.existingLoans}
          onChange={handleChange}
          options={[
            { value: "no", label: "No existing loans" },
            { value: "yes", label: "Yes, I have existing EMIs" },
          ]}
        />
        {fields.existingLoans === "yes" && (
          <FormInput
            label="Total Monthly EMI Outgoing (₹)"
            name="existingEMI"
            type="number"
            value={fields.existingEMI}
            onChange={handleChange}
            error={errors.existingEMI}
            required
            placeholder="Sum of all current EMIs"
          />
        )}
      </div>

      {/* EMI Calculator preview */}
      <div className="emi-calculator">
        <h3 className="section-heading">EMI Preview</h3>
        <button className="btn-calculate" onClick={calculateEMIPreview}>Calculate Indicative EMI</button>
        {emiPreview && (
          <div className="emi-result">
            <div className="emi-box">
              <span>Monthly EMI</span>
              <strong>₹{emiPreview.emi.toLocaleString("en-IN")}</strong>
            </div>
            <div className="emi-box">
              <span>Interest Rate</span>
              <strong>{emiPreview.rate}% p.a.</strong>
            </div>
            <div className="emi-box">
              <span>Tenure</span>
              <strong>{emiPreview.months} months</strong>
            </div>
            <p className="emi-note">* Indicative only. Final rate depends on credit assessment.</p>
          </div>
        )}
      </div>

      <NavButtons onBack={goBack} onNext={handleNext} />
    </div>
  );
}
