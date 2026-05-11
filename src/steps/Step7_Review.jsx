import { NavButtons } from "../components/FormComponents";

export default function ReviewSummary({ formData, goNext, goBack, goToStep }) {

  const loanTypeLabel = { personal: "Personal Loan", home: "Home Loan", business: "Business Loan" };

  // Reusable review row
  function Row({ label, value }) {
    if (!value) return null;
    return (
      <div className="review-row">
        <span className="review-label">{label}</span>
        <span className="review-value">{value}</span>
      </div>
    );
  }

  // Section block with edit button
  function Section({ title, stepIndex, children }) {
    return (
      <div className="review-section">
        <div className="review-section-header">
          <h3>{title}</h3>
          <button className="btn-edit" onClick={() => goToStep(stepIndex)}>✏️ Edit</button>
        </div>
        {children}
      </div>
    );
  }

  const formatAmount = (val) =>
    val ? `₹${parseFloat(val).toLocaleString("en-IN")}` : "—";

  return (
    <div className="step-wrapper">
      <h2 className="step-title">Review Your Application</h2>
      <p className="step-subtitle">Please review all details carefully before submitting</p>

      <Section title="Loan Type" stepIndex={0}>
        <Row label="Loan Type" value={loanTypeLabel[formData.loanType] || formData.loanType} />
      </Section>

      <Section title="Personal Details" stepIndex={1}>
        <Row label="Full Name" value={formData.fullName} />
        <Row label="Date of Birth" value={formData.dob} />
        <Row label="Gender" value={formData.gender} />
        <Row label="Email" value={formData.email} />
        <Row label="Mobile" value={formData.phone} />
        <Row label="PAN" value={formData.pan} />
        <Row label="PAN Verified" value={formData.panVerified ? "✅ Yes" : "❌ No"} />
        <Row label="Aadhaar Verified" value={formData.aadhaarVerified ? "✅ Yes" : "❌ No"} />
        <Row label="Address" value={formData.address} />
        <Row label="City / State" value={`${formData.city || ""}, ${formData.state || ""}`} />
      </Section>

      <Section title="Employment & Income" stepIndex={2}>
        <Row label="Employment Type" value={formData.employmentType} />
        <Row label="Monthly Income" value={formatAmount(formData.monthlyIncome)} />
        <Row label="Company" value={formData.companyName} />
        <Row label="Designation" value={formData.designation} />
        <Row label="Work Experience" value={formData.workExperience} />
        <Row label="CIBIL Score" value={formData.cibilScore} />
        {formData.businessName && <Row label="Business Name" value={formData.businessName} />}
        {formData.annualTurnover && <Row label="Annual Turnover" value={formatAmount(formData.annualTurnover)} />}
      </Section>

      <Section title="Loan Requirements" stepIndex={3}>
        <Row label="Loan Amount" value={formatAmount(formData.loanAmount)} />
        <Row label="Purpose" value={formData.loanPurpose} />
        <Row label="Tenure" value={formData.preferredTenure ? `${formData.preferredTenure} months` : "—"} />
        <Row label="Existing EMIs" value={formData.existingLoans === "yes" ? formatAmount(formData.existingEMI) : "None"} />
        {formData.propertyLocation && <Row label="Property Location" value={formData.propertyLocation} />}
      </Section>

      <Section title="Documents" stepIndex={4}>
        {formData.documents ? (
          Object.entries(formData.documents).map(([key, doc]) => (
            <Row key={key} label={key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} value={`✅ ${doc.name} (${doc.size})`} />
          ))
        ) : (
          <p className="review-value">No documents uploaded</p>
        )}
      </Section>

      <Section title="E-Signature" stepIndex={5}>
        <Row label="Declaration Agreed" value={formData.termsAgreed ? "✅ Yes" : "❌ No"} />
        <Row label="Signed At" value={formData.signedAt ? new Date(formData.signedAt).toLocaleString("en-IN") : "—"} />
        {formData.signature && (
          <div className="sig-preview-box">
            <span className="review-label">Signature</span>
            <img src={formData.signature} alt="Signature" className="sig-preview" />
          </div>
        )}
      </Section>

      <div className="review-notice">
        ⚠️ By clicking "Submit Application", you confirm all details are correct. Your application will be processed by our team within 24–48 hours.
      </div>

      <NavButtons onBack={goBack} onNext={goNext} nextLabel="Submit Application →" />
    </div>
  );
}
