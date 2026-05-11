import { useState } from "react";
import { FormInput, FormSelect, NavButtons } from "../components/FormComponents";
import { validatePAN, validateAadhaar, validatePhone, validateEmail, isEmpty, verifyPAN, verifyAadhaar } from "../utils/validators";

export default function PersonalDetails({ formData, updateFormData, goNext, goBack }) {
  const [fields, setFields] = useState({
    fullName: formData.fullName || "",
    dob: formData.dob || "",
    gender: formData.gender || "",
    email: formData.email || "",
    phone: formData.phone || "",
    pan: formData.pan || "",
    aadhaar: formData.aadhaar || "",
    address: formData.address || "",
    pincode: formData.pincode || "",
    city: formData.city || "",
    state: formData.state || "",
  });

  const [errors, setErrors] = useState({});
  const [panStatus, setPanStatus] = useState(formData.panVerified ? "verified" : "idle"); // idle | loading | verified | failed
  const [aadhaarStatus, setAadhaarStatus] = useState(formData.aadhaarVerified ? "verified" : "idle");
  const [panName, setPanName] = useState(formData.panName || "");
  const [aadhaarAddress, setAadhaarAddress] = useState(formData.aadhaarAddress || "");

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // Simulate PAN verification — calls fake API
  async function handleVerifyPAN() {
    if (!validatePAN(fields.pan)) {
      setErrors((prev) => ({ ...prev, pan: "Invalid PAN format (eg: ABCDE1234F)" }));
      return;
    }
    setPanStatus("loading");
    const result = await verifyPAN(fields.pan);
    if (result.valid) {
      setPanStatus("verified");
      setPanName(result.name);
    } else {
      setPanStatus("failed");
    }
  }

  // Simulate Aadhaar verification
  async function handleVerifyAadhaar() {
    if (!validateAadhaar(fields.aadhaar)) {
      setErrors((prev) => ({ ...prev, aadhaar: "Aadhaar must be 12 digits" }));
      return;
    }
    setAadhaarStatus("loading");
    const result = await verifyAadhaar(fields.aadhaar);
    if (result.valid) {
      setAadhaarStatus("verified");
      setAadhaarAddress(result.address);
      // Auto-fill address from Aadhaar
      setFields((prev) => ({ ...prev, address: result.address }));
    } else {
      setAadhaarStatus("failed");
    }
  }

  function validate() {
    const newErrors = {};
    if (isEmpty(fields.fullName)) newErrors.fullName = "Full name is required";
    if (isEmpty(fields.dob)) newErrors.dob = "Date of birth is required";
    if (isEmpty(fields.gender)) newErrors.gender = "Gender is required";
    if (!validateEmail(fields.email)) newErrors.email = "Enter a valid email";
    if (!validatePhone(fields.phone)) newErrors.phone = "Enter valid 10-digit mobile number";
    if (panStatus !== "verified") newErrors.pan = "Please verify your PAN";
    if (aadhaarStatus !== "verified") newErrors.aadhaar = "Please verify your Aadhaar";
    if (isEmpty(fields.pincode) || !/^\d{6}$/.test(fields.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";
    if (isEmpty(fields.city)) newErrors.city = "City is required";
    if (isEmpty(fields.state)) newErrors.state = "State is required";
    return newErrors;
  }

  function handleNext() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    updateFormData({
      ...fields,
      panVerified: true,
      aadhaarVerified: true,
      panName,
      aadhaarAddress,
    });
    goNext();
  }

  const statusIcon = (status) => {
    if (status === "loading") return <span className="verify-loading">⏳ Verifying...</span>;
    if (status === "verified") return <span className="verify-success">✅ Verified</span>;
    if (status === "failed") return <span className="verify-fail">❌ Not found</span>;
    return null;
  };

  return (
    <div className="step-wrapper">
      <h2 className="step-title">Personal Details</h2>
      <p className="step-subtitle">Enter your personal information as per government records</p>

      <div className="form-grid">
        <FormInput label="Full Name" name="fullName" value={fields.fullName} onChange={handleChange} error={errors.fullName} required />
        <FormInput label="Date of Birth" name="dob" type="date" value={fields.dob} onChange={handleChange} error={errors.dob} required />
        <FormSelect
          label="Gender"
          name="gender"
          value={fields.gender}
          onChange={handleChange}
          error={errors.gender}
          required
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />
        <FormInput label="Email Address" name="email" type="email" value={fields.email} onChange={handleChange} error={errors.email} required />
        <FormInput label="Mobile Number" name="phone" type="tel" value={fields.phone} onChange={handleChange} error={errors.phone} required placeholder="10-digit number" />
      </div>

      {/* PAN Verification */}
      <div className="verify-section">
        <h3 className="section-heading">PAN Verification</h3>
        <div className="verify-row">
          <FormInput
            label="PAN Number"
            name="pan"
            value={fields.pan}
            onChange={(e) => { handleChange(e); setPanStatus("idle"); }}
            error={errors.pan}
            required
            placeholder="ABCDE1234F"
          />
          <button
            className="btn-verify"
            onClick={handleVerifyPAN}
            disabled={panStatus === "loading" || panStatus === "verified"}
          >
            {panStatus === "verified" ? "Verified ✓" : "Verify PAN"}
          </button>
        </div>
        {statusIcon(panStatus)}
        {panName && <p className="verify-detail">Name on PAN: <strong>{panName}</strong></p>}
      </div>

      {/* Aadhaar Verification */}
      <div className="verify-section">
        <h3 className="section-heading">Aadhaar Verification</h3>
        <div className="verify-row">
          <FormInput
            label="Aadhaar Number"
            name="aadhaar"
            value={fields.aadhaar}
            onChange={(e) => { handleChange(e); setAadhaarStatus("idle"); }}
            error={errors.aadhaar}
            required
            placeholder="12-digit Aadhaar"
          />
          <button
            className="btn-verify"
            onClick={handleVerifyAadhaar}
            disabled={aadhaarStatus === "loading" || aadhaarStatus === "verified"}
          >
            {aadhaarStatus === "verified" ? "Verified ✓" : "Verify Aadhaar"}
          </button>
        </div>
        {statusIcon(aadhaarStatus)}
        {aadhaarAddress && <p className="verify-detail">Address from Aadhaar: <strong>{aadhaarAddress}</strong></p>}
      </div>

      {/* Address */}
      <div className="verify-section">
        <h3 className="section-heading">Address Details</h3>
        <FormInput label="Full Address" name="address" value={fields.address} onChange={handleChange} error={errors.address} required placeholder="Auto-filled after Aadhaar verify" />
        <div className="form-grid">
          <FormInput label="Pincode" name="pincode" value={fields.pincode} onChange={handleChange} error={errors.pincode} required placeholder="6-digit pincode" />
          <FormInput label="City" name="city" value={fields.city} onChange={handleChange} error={errors.city} required />
          <FormSelect
            label="State"
            name="state"
            value={fields.state}
            onChange={handleChange}
            error={errors.state}
            required
            options={[
              { value: "Karnataka", label: "Karnataka" },
              { value: "Maharashtra", label: "Maharashtra" },
              { value: "Delhi", label: "Delhi" },
              { value: "Tamil Nadu", label: "Tamil Nadu" },
              { value: "Bihar", label: "Bihar" },
              { value: "Uttar Pradesh", label: "Uttar Pradesh" },
              { value: "West Bengal", label: "West Bengal" },
              { value: "Gujarat", label: "Gujarat" },
              { value: "Rajasthan", label: "Rajasthan" },
              { value: "Telangana", label: "Telangana" },
            ]}
          />
        </div>
      </div>

      <NavButtons onBack={goBack} onNext={handleNext} />
    </div>
  );
}
