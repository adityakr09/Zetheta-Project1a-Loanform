import { useState } from "react";
import { NavButtons } from "../components/FormComponents";

// Which docs are required for each loan type
const REQUIRED_DOCS = {
  personal: [
    { key: "pan_card", label: "PAN Card", hint: "Clear scan of PAN card" },
    { key: "aadhaar_card", label: "Aadhaar Card", hint: "Front and back" },
    { key: "salary_slip", label: "Latest 3 Salary Slips", hint: "Last 3 months" },
    { key: "bank_statement", label: "Bank Statement (6 months)", hint: "PDF preferred" },
    { key: "photo", label: "Passport Photo", hint: "Recent photograph" },
  ],
  home: [
    { key: "pan_card", label: "PAN Card", hint: "Clear scan" },
    { key: "aadhaar_card", label: "Aadhaar Card", hint: "Front and back" },
    { key: "salary_slip", label: "Latest 3 Salary Slips", hint: "Last 3 months" },
    { key: "bank_statement", label: "Bank Statement (12 months)", hint: "Full year statement" },
    { key: "property_docs", label: "Property Documents", hint: "Sale deed / agreement" },
    { key: "photo", label: "Passport Photo", hint: "Recent photograph" },
  ],
  business: [
    { key: "pan_card", label: "PAN Card (Personal)", hint: "Proprietor/Director PAN" },
    { key: "business_pan", label: "Business PAN", hint: "Company/firm PAN" },
    { key: "gst_cert", label: "GST Certificate", hint: "If registered" },
    { key: "bank_statement", label: "Business Bank Statement (12 months)", hint: "Primary business account" },
    { key: "itr", label: "ITR (last 2 years)", hint: "Income Tax Returns" },
    { key: "photo", label: "Passport Photo", hint: "Proprietor/Director photo" },
  ],
};

export default function DocumentUpload({ formData, updateFormData, goNext, goBack }) {
  const loanType = formData.loanType || "personal";
  const requiredDocs = REQUIRED_DOCS[loanType];

  const [uploads, setUploads] = useState(formData.documents || {});
  const [errors, setErrors] = useState({});

  function handleFileChange(e, docKey) {
    const file = e.target.files[0];
    if (!file) return;

    // Basic file validation
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [docKey]: "Only JPG, PNG, PDF allowed" }));
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [docKey]: "File size must be under 5MB" }));
      return;
    }

    // Create preview URL for images
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

    setUploads((prev) => ({
      ...prev,
      [docKey]: {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type,
        previewUrl,
        uploaded: true,
      },
    }));
    setErrors((prev) => ({ ...prev, [docKey]: "" }));
  }

  function removeFile(docKey) {
    setUploads((prev) => {
      const updated = { ...prev };
      delete updated[docKey];
      return updated;
    });
  }

  function handleNext() {
    // Check all required docs are uploaded
    const newErrors = {};
    requiredDocs.forEach((doc) => {
      if (!uploads[doc.key]) {
        newErrors[doc.key] = "This document is required";
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    updateFormData({ documents: uploads });
    goNext();
  }

  const uploadedCount = requiredDocs.filter((d) => uploads[d.key]).length;

  return (
    <div className="step-wrapper">
      <h2 className="step-title">Document Upload</h2>
      <p className="step-subtitle">
        Upload clear copies of required documents. Accepted: JPG, PNG, PDF (max 5MB each)
      </p>

      {/* Progress bar for uploads */}
      <div className="upload-progress-bar">
        <div className="upload-progress-track">
          <div
            className="upload-progress-fill"
            style={{ width: `${(uploadedCount / requiredDocs.length) * 100}%` }}
          />
        </div>
        <span>{uploadedCount} / {requiredDocs.length} documents uploaded</span>
      </div>

      <div className="doc-list">
        {requiredDocs.map((doc) => {
          const uploaded = uploads[doc.key];
          return (
            <div key={doc.key} className={`doc-item ${uploaded ? "doc-uploaded" : ""} ${errors[doc.key] ? "doc-error" : ""}`}>
              <div className="doc-info">
                <span className="doc-label">{doc.label} <span className="required">*</span></span>
                <span className="doc-hint">{doc.hint}</span>
              </div>

              {uploaded ? (
                <div className="doc-uploaded-info">
                  {/* Show image preview if it's an image */}
                  {uploaded.previewUrl && (
                    <img src={uploaded.previewUrl} alt="preview" className="doc-preview-img" />
                  )}
                  {!uploaded.previewUrl && <span className="pdf-icon">📄</span>}
                  <div className="doc-file-info">
                    <span className="doc-filename">{uploaded.name}</span>
                    <span className="doc-filesize">{uploaded.size}</span>
                  </div>
                  <button className="btn-remove" onClick={() => removeFile(doc.key)}>✕ Remove</button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="file-input-hidden"
                    onChange={(e) => handleFileChange(e, doc.key)}
                  />
                  <span className="upload-btn">📎 Choose File</span>
                </label>
              )}

              {errors[doc.key] && <span className="error-msg">{errors[doc.key]}</span>}
            </div>
          );
        })}
      </div>

      <NavButtons onBack={goBack} onNext={handleNext} />
    </div>
  );
}
