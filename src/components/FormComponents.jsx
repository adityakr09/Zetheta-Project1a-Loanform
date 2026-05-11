// Simple reusable input — no library, plain React
export function FormInput({ label, name, type = "text", value, onChange, error, required, placeholder }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        className={`form-input ${error ? "input-error" : ""}`}
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder || ""}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}

export function FormSelect({ label, name, value, onChange, error, required, options }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <select
        className={`form-input ${error ? "input-error" : ""}`}
        name={name}
        value={value || ""}
        onChange={onChange}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}

export function NavButtons({ onBack, onNext, nextLabel = "Next →", showBack = true }) {
  return (
    <div className="nav-buttons">
      {showBack && (
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
      )}
      <button className="btn-next" onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );
}
