import { useEffect, useState } from "react";
import { calculateEligibility } from "../utils/validators";

export default function PreApproval({ formData }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [appId] = useState(() => "LA" + Date.now().toString().slice(-8));

  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
      const eligibility = calculateEligibility(formData);
      setResult(eligibility);
      setLoading(false);
      // Clear saved session after submission
      localStorage.removeItem("loan_form_data");
      localStorage.removeItem("loan_form_step");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  function formatAmount(val) {
    return `₹${val.toLocaleString("en-IN")}`;
  }

  if (loading) {
    return (
      <div className="step-wrapper preapproval-loading">
        <div className="loader-circle" />
        <h2>Processing your application...</h2>
        <p>Running eligibility checks and credit assessment</p>
        <div className="processing-steps">
          <p>✅ Application submitted</p>
          <p>⏳ Verifying documents</p>
          <p>⏳ Running credit assessment</p>
          <p>⏳ Generating pre-approval report</p>
        </div>
      </div>
    );
  }

  return (
    <div className="step-wrapper">
      <h2 className="step-title">
        {result.approved ? "🎉 Pre-Approval Result" : "⚠️ Application Status"}
      </h2>

      <div className={`preapproval-card ${result.approved ? "approved" : "rejected"}`}>
        {result.approved ? (
          <>
            <div className="approval-badge">✅ PRE-APPROVED</div>
            <p className="approval-msg">
              Congratulations, <strong>{formData.fullName || "Applicant"}</strong>! Your loan application has been pre-approved.
            </p>
          </>
        ) : (
          <>
            <div className="rejection-badge">❌ NOT ELIGIBLE</div>
            <p className="rejection-msg">
              We're sorry. Your application does not meet our eligibility criteria at this time.
            </p>
            <div className="rejection-reason">
              <strong>Reason:</strong> {result.reason}
            </div>
          </>
        )}
      </div>

      {/* Application Reference */}
      <div className="app-reference">
        <span>Application Reference ID:</span>
        <strong>{appId}</strong>
      </div>

      {/* Summary stats */}
      {result.approved && (
        <div className="approval-summary">
          <h3 className="section-heading">Loan Summary</h3>
          <div className="approval-grid">
            <div className="approval-stat">
              <span>Requested Amount</span>
              <strong>{formatAmount(parseFloat(formData.loanAmount))}</strong>
            </div>
            <div className="approval-stat">
              <span>Eligible Amount</span>
              <strong>{formatAmount(result.maxEligible)}</strong>
            </div>
            <div className="approval-stat">
              <span>Interest Rate</span>
              <strong>{result.interestRate}% p.a.</strong>
            </div>
            <div className="approval-stat">
              <span>Tenure</span>
              <strong>{result.tenure} months</strong>
            </div>
            <div className="approval-stat highlight">
              <span>Estimated Monthly EMI</span>
              <strong>{formatAmount(result.emi)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Next steps */}
      <div className="next-steps">
        <h3 className="section-heading">Next Steps</h3>
        {result.approved ? (
          <ol className="steps-list">
            <li>Our loan officer will contact you within <strong>24–48 hours</strong></li>
            <li>Document verification will be completed at your nearest branch or via video KYC</li>
            <li>Once verified, loan amount will be disbursed to your account within <strong>3–5 business days</strong></li>
            <li>Save your Reference ID: <strong>{appId}</strong> for tracking</li>
          </ol>
        ) : (
          <ol className="steps-list">
            <li>Improve your CIBIL score by clearing existing dues</li>
            <li>You may reapply after <strong>6 months</strong></li>
            <li>Consider applying for a lower loan amount</li>
            <li>Contact support at <strong>1800-XXX-XXXX</strong> for assistance</li>
          </ol>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button
          className="btn-next"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Apply for Another Loan
        </button>
      </div>
    </div>
  );
}
