import { useState } from "react";
import { FormInput, FormSelect, NavButtons } from "../components/FormComponents";
import { isEmpty } from "../utils/validators";

export default function EmploymentDetails({ formData, updateFormData, goNext, goBack }) {
  const [fields, setFields] = useState({
    employmentType: formData.employmentType || "",
    companyName: formData.companyName || "",
    designation: formData.designation || "",
    monthlyIncome: formData.monthlyIncome || "",
    workExperience: formData.workExperience || "",
    officePincode: formData.officePincode || "",
    // Business loan specific
    businessName: formData.businessName || "",
    businessType: formData.businessType || "",
    businessVintage: formData.businessVintage || "",
    annualTurnover: formData.annualTurnover || "",
    gstNumber: formData.gstNumber || "",
    // CIBIL
    cibilScore: formData.cibilScore || "",
  });

  const [errors, setErrors] = useState({});
  const loanType = formData.loanType;

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (isEmpty(fields.employmentType)) newErrors.employmentType = "Required";
    if (isEmpty(fields.monthlyIncome)) newErrors.monthlyIncome = "Required";
    if (parseFloat(fields.monthlyIncome) < 15000) newErrors.monthlyIncome = "Minimum income required: ₹15,000";

    // Salaried fields
    if (fields.employmentType === "salaried") {
      if (isEmpty(fields.companyName)) newErrors.companyName = "Company name required";
      if (isEmpty(fields.designation)) newErrors.designation = "Designation required";
      if (isEmpty(fields.workExperience)) newErrors.workExperience = "Work experience required";
    }

    // Business loan extra validation
    if (loanType === "business") {
      if (isEmpty(fields.businessName)) newErrors.businessName = "Business name required";
      if (isEmpty(fields.businessVintage)) newErrors.businessVintage = "Business vintage required";
      if (isEmpty(fields.annualTurnover)) newErrors.annualTurnover = "Annual turnover required";
    }

    if (isEmpty(fields.cibilScore)) newErrors.cibilScore = "CIBIL score required";
    if (parseInt(fields.cibilScore) < 300 || parseInt(fields.cibilScore) > 900) {
      newErrors.cibilScore = "CIBIL score must be between 300 and 900";
    }

    return newErrors;
  }

  function handleNext() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    updateFormData(fields);
    goNext();
  }

  const isSalaried = fields.employmentType === "salaried";
  const isSelfEmployed = fields.employmentType === "self-employed";

  // CIBIL color indicator
  const score = parseInt(fields.cibilScore);
  const cibilColor = score >= 750 ? "#22c55e" : score >= 650 ? "#f59e0b" : "#ef4444";
  const cibilLabel = score >= 750 ? "Excellent" : score >= 700 ? "Good" : score >= 650 ? "Fair" : "Poor";

  return (
    <div className="step-wrapper">
      <h2 className="step-title">Employment & Income Details</h2>
      <p className="step-subtitle">
        {loanType === "business"
          ? "Tell us about your business and financials"
          : "Your income details help us calculate eligibility"}
      </p>

      <div className="form-grid">
        <FormSelect
          label="Employment Type"
          name="employmentType"
          value={fields.employmentType}
          onChange={handleChange}
          error={errors.employmentType}
          required
          options={[
            { value: "salaried", label: "Salaried" },
            { value: "self-employed", label: "Self Employed" },
            { value: "business", label: "Business Owner" },
          ]}
        />
        <FormInput
          label="Monthly Net Income (₹)"
          name="monthlyIncome"
          type="number"
          value={fields.monthlyIncome}
          onChange={handleChange}
          error={errors.monthlyIncome}
          required
          placeholder="Take-home salary per month"
        />
      </div>

      {/* Salaried specific fields */}
      {isSalaried && (
        <div className="conditional-section">
          <h3 className="section-heading">Employment Details</h3>
          <div className="form-grid">
            <FormInput label="Company / Employer Name" name="companyName" value={fields.companyName} onChange={handleChange} error={errors.companyName} required />
            <FormInput label="Designation / Role" name="designation" value={fields.designation} onChange={handleChange} error={errors.designation} required />
            <FormSelect
              label="Work Experience"
              name="workExperience"
              value={fields.workExperience}
              onChange={handleChange}
              error={errors.workExperience}
              required
              options={[
                { value: "0-1", label: "Less than 1 year" },
                { value: "1-3", label: "1 – 3 years" },
                { value: "3-5", label: "3 – 5 years" },
                { value: "5+", label: "5+ years" },
              ]}
            />
            <FormInput label="Office Pincode" name="officePincode" value={fields.officePincode} onChange={handleChange} error={errors.officePincode} placeholder="Optional" />
          </div>
        </div>
      )}

      {/* Business loan specific fields */}
      {loanType === "business" && (
        <div className="conditional-section">
          <h3 className="section-heading">Business Details</h3>
          <div className="form-grid">
            <FormInput label="Business Name" name="businessName" value={fields.businessName} onChange={handleChange} error={errors.businessName} required />
            <FormSelect
              label="Business Type"
              name="businessType"
              value={fields.businessType}
              onChange={handleChange}
              error={errors.businessType}
              options={[
                { value: "proprietorship", label: "Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "pvt-ltd", label: "Private Limited" },
                { value: "llp", label: "LLP" },
              ]}
            />
            <FormSelect
              label="Business Vintage"
              name="businessVintage"
              value={fields.businessVintage}
              onChange={handleChange}
              error={errors.businessVintage}
              required
              options={[
                { value: "1-2", label: "1 – 2 years" },
                { value: "2-5", label: "2 – 5 years" },
                { value: "5+", label: "5+ years" },
              ]}
            />
            <FormInput label="Annual Turnover (₹)" name="annualTurnover" type="number" value={fields.annualTurnover} onChange={handleChange} error={errors.annualTurnover} required />
            <FormInput label="GST Number" name="gstNumber" value={fields.gstNumber} onChange={handleChange} error={errors.gstNumber} placeholder="Optional but preferred" />
          </div>
        </div>
      )}

      {/* CIBIL score */}
      <div className="verify-section">
        <h3 className="section-heading">Credit Score (CIBIL)</h3>
        <FormInput
          label="Your CIBIL Score"
          name="cibilScore"
          type="number"
          value={fields.cibilScore}
          onChange={handleChange}
          error={errors.cibilScore}
          required
          placeholder="300 – 900"
        />
        {score >= 300 && score <= 900 && (
          <div className="cibil-indicator" style={{ borderLeft: `4px solid ${cibilColor}` }}>
            <span style={{ color: cibilColor, fontWeight: "bold" }}>{cibilLabel}</span>
            <span> — {score >= 750 ? "Best interest rates available" : score >= 650 ? "Standard rates apply" : "Loan approval may be difficult"}</span>
          </div>
        )}
      </div>

      <NavButtons onBack={goBack} onNext={handleNext} />
    </div>
  );
}
