export default function StepIndicator({ steps, currentStep, goToStep }) {
  return (
    <div className="step-indicator">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={index}
            className={`step-item ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
            onClick={() => goToStep(index)}
            title={label}
          >
            <div className="step-circle">
              {isCompleted ? "✓" : index + 1}
            </div>
            <span className="step-label">{label}</span>
            {index < steps.length - 1 && (
              <div className={`step-line ${isCompleted ? "completed" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
