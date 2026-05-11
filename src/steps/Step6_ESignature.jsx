import { useRef, useState, useEffect } from "react";
import { NavButtons } from "../components/FormComponents";

export default function ESignature({ formData, updateFormData, goNext, goBack }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agreed, setAgreed] = useState(formData.termsAgreed || false);
  const [error, setError] = useState("");
  const [savedSignature, setSavedSignature] = useState(formData.signature || null);

  // If already signed in previous session, show it
  useEffect(() => {
    if (savedSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = savedSignature;
      setHasSigned(true);
    }
  }, []);

  // Get canvas coordinates (handles mobile too)
  function getCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
    setError("");
  }

  function draw(e) {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoords(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1a3c6e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function stopDrawing(e) {
    e.preventDefault();
    setIsDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSavedSignature(null);
  }

  function handleNext() {
    if (!hasSigned) {
      setError("Please draw your signature to continue");
      return;
    }
    if (!agreed) {
      setError("Please agree to the terms and declaration");
      return;
    }

    // Save canvas as base64 image
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL("image/png");

    updateFormData({
      signature: signatureData,
      termsAgreed: true,
      signedAt: new Date().toISOString(),
    });
    goNext();
  }

  return (
    <div className="step-wrapper">
      <h2 className="step-title">E-Signature & Declaration</h2>
      <p className="step-subtitle">Sign digitally using your mouse or finger (on mobile)</p>

      {/* Declaration text */}
      <div className="declaration-box">
        <h3>📋 Declaration</h3>
        <p>
          I, <strong>{formData.fullName || "the applicant"}</strong>, hereby declare that all information
          provided in this loan application is true and accurate to the best of my knowledge.
          I authorize the lender to verify the provided information with relevant authorities
          including CIBIL, NSDL, and UIDAI. I understand that providing false information may
          result in rejection of the application and legal action.
        </p>
        <p>
          I agree to the <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong> of LoanEase
          and consent to electronic communication regarding this application.
        </p>
      </div>

      {/* Signature pad */}
      <div className="signature-section">
        <div className="signature-header">
          <span>Draw your signature below:</span>
          {hasSigned && (
            <button className="btn-clear-sig" onClick={clearSignature}>
              Clear & Redraw
            </button>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={580}
          height={180}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {!hasSigned && (
          <p className="sig-placeholder">✍️ Draw your signature here</p>
        )}
      </div>

      {/* Agreement checkbox */}
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
        />
        <span>
          I have read and agree to the declaration above, Terms & Conditions, and Privacy Policy.
        </span>
      </label>

      {error && <p className="error-msg" style={{ textAlign: "center" }}>{error}</p>}

      <NavButtons onBack={goBack} onNext={handleNext} nextLabel="Submit for Review →" />
    </div>
  );
}
