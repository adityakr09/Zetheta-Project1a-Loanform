import { useState, useEffect } from "react";
import StepIndicator from "./components/StepIndicator";
import LoanTypeSelector from "./steps/Step1_LoanType";
import PersonalDetails from "./steps/Step2_PersonalDetails";
import EmploymentDetails from "./steps/Step3_Employment";
import LoanDetails from "./steps/Step4_LoanDetails";
import DocumentUpload from "./steps/Step5_Documents";
import ESignature from "./steps/Step6_ESignature";
import ReviewSummary from "./steps/Step7_Review";
import PreApproval from "./steps/Step8_PreApproval";
import "./App.css";

const STEPS = [
  "Loan Type",
  "Personal Info",
  "Employment",
  "Loan Details",
  "Documents",
  "E-Signature",
  "Review",
  "Pre-Approval",
];

// Load saved progress from localStorage (auto-save/resume feature)
function loadSavedData() {
  try {
    const saved = localStorage.getItem("loan_form_data");
    const savedStep = localStorage.getItem("loan_form_step");
    return {
      formData: saved ? JSON.parse(saved) : {},
      savedStep: savedStep ? parseInt(savedStep) : 0,
    };
  } catch {
    return { formData: {}, savedStep: 0 };
  }
}

export default function App() {
  const { formData: initialData, savedStep } = loadSavedData();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [resumePrompt, setResumePrompt] = useState(savedStep > 0);

  // Auto-save on every formData change
  useEffect(() => {
    localStorage.setItem("loan_form_data", JSON.stringify(formData));
    localStorage.setItem("loan_form_step", currentStep.toString());
  }, [formData, currentStep]);

  // Merge incoming step data into global formData
  function updateFormData(stepData) {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }

  function goNext() {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function goBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  function goToStep(index) {
    // Only allow going back to completed steps
    if (index < currentStep) setCurrentStep(index);
  }

  function handleResume() {
    setCurrentStep(savedStep);
    setResumePrompt(false);
  }

  function handleFresh() {
    localStorage.clear();
    setFormData({});
    setCurrentStep(0);
    setResumePrompt(false);
  }

  // Props passed to every step
  const stepProps = { formData, updateFormData, goNext, goBack };

  const steps = [
    <LoanTypeSelector {...stepProps} />,
    <PersonalDetails {...stepProps} />,
    <EmploymentDetails {...stepProps} />,
    <LoanDetails {...stepProps} />,
    <DocumentUpload {...stepProps} />,
    <ESignature {...stepProps} />,
    <ReviewSummary {...stepProps} goToStep={goToStep} />,
    <PreApproval {...stepProps} />,
  ];

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo">🏦 LoanEase</div>
        <p className="tagline">Quick. Simple. Transparent.</p>
      </header>

      {/* Resume prompt if previous session found */}
      {resumePrompt && (
        <div className="resume-banner">
          <span>📋 You have a saved application. Resume where you left off?</span>
          <div className="resume-actions">
            <button className="btn-resume" onClick={handleResume}>Resume</button>
            <button className="btn-fresh" onClick={handleFresh}>Start Fresh</button>
          </div>
        </div>
      )}

      <div className="form-container">
        <StepIndicator steps={STEPS} currentStep={currentStep} goToStep={goToStep} />
        <div className="step-content">{steps[currentStep]}</div>
      </div>
    </div>
  );
}
