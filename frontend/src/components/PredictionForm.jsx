import { LoadingSpinner } from "./LoadingSpinner.jsx";

const FIELD_ORDER = [
  "Age",
  "Branch",
  "CGPA",
  "Internships",
  "Projects",
  "Coding_Skills",
  "Communication_Skills",
  "Aptitude_Test_Score",
  "Soft_Skills_Rating",
  "Certifications",
  "Backlogs",
];

const FIELD_LABELS = {
  Age: "Age",
  Branch: "Branch",
  CGPA: "CGPA",
  Internships: "Internships",
  Projects: "Projects",
  Coding_Skills: "Coding Skills",
  Communication_Skills: "Communication Skills",
  Aptitude_Test_Score: "Aptitude Test Score",
  Soft_Skills_Rating: "Soft Skills Rating",
  Certifications: "Certifications",
  Backlogs: "Backlogs",
};

const PLACEHOLDERS = {
  Age: "18 - 30",
  CGPA: "0 - 10",
  Internships: "0 - 5",
  Projects: "0 - 10",
  Coding_Skills: "0 - 10",
  Communication_Skills: "0 - 10",
  Aptitude_Test_Score: "0 - 100",
  Soft_Skills_Rating: "0 - 10",
  Certifications: "0 - 10",
  Backlogs: "0 - 10",
};

export function PredictionForm({
  formData,
  errors,
  onChange,
  onBlur,
  onSubmit,
  loading,
  disabled,
  branchOptions,
  fieldRules,
}) {
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="grid">
        {FIELD_ORDER.map((name) => {
          const label = FIELD_LABELS[name] ?? name;
          const error = errors?.[name];
          const rule = fieldRules?.[name];

          if (name === "Branch") {
            return (
              <div className="field" key={name}>
                <label className="label" htmlFor={name}>
                  {label} <span className="req">*</span>
                </label>
                <select
                  id={name}
                  name={name}
                  className={`input ${error ? "inputError" : ""}`}
                  value={formData.Branch}
                  onChange={(e) => onChange(name, e.target.value)}
                  onBlur={() => onBlur(name)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${name}-error` : undefined}
                >
                  <option value="">Select Branch</option>
                  {branchOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {error ? (
                  <div className="fieldError" id={`${name}-error`}>
                    {error}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <div className={`field ${name === "Backlogs" ? "fieldSpan2" : ""}`} key={name}>
              <label className="label" htmlFor={name}>
                {label} <span className="req">*</span>
              </label>
              <input
                id={name}
                name={name}
                className={`input ${error ? "inputError" : ""}`}
                type="number"
                inputMode="decimal"
                step={rule?.step ?? 1}
                min={rule?.min}
                max={rule?.max}
                placeholder={PLACEHOLDERS[name] ?? ""}
                value={formData[name]}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => onBlur(name)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${name}-error` : undefined}
              />
              {error ? (
                <div className="fieldError" id={`${name}-error`}>
                  {error}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button className="btnPrimary" type="submit" disabled={disabled}>
          {loading ? (
            <span className="btnRow">
              <LoadingSpinner />
              Predicting…
            </span>
          ) : (
            "Predict"
          )}
        </button>
        <div className="hint">
          Tip: keep values within the allowed ranges (e.g., CGPA 0–10, Aptitude 0–100).
        </div>
      </div>
    </form>
  );
}

