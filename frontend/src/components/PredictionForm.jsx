import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

const FIELD_META = [
  { key: "Age", label: "Age", placeholder: "e.g., 21" },
  { key: "Branch", label: "Branch (encoded)", placeholder: "e.g., 2" },
  { key: "CGPA", label: "CGPA", placeholder: "e.g., 8.2", step: "0.01" },
  { key: "Internships", label: "Internships", placeholder: "e.g., 1" },
  { key: "Projects", label: "Projects", placeholder: "e.g., 3" },
  { key: "Coding_Skills", label: "Coding Skills", placeholder: "e.g., 7", step: "0.1" },
  { key: "Communication_Skills", label: "Communication Skills", placeholder: "e.g., 6", step: "0.1" },
  { key: "Aptitude_Test_Score", label: "Aptitude Test Score", placeholder: "e.g., 75", step: "0.1" },
  { key: "Soft_Skills_Rating", label: "Soft Skills Rating", placeholder: "e.g., 8", step: "0.1" },
  { key: "Certifications", label: "Certifications", placeholder: "e.g., 2" },
  { key: "Backlogs", label: "Backlogs", placeholder: "e.g., 0" },
];

function isNumericString(v) {
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (s === "") return false;
  return /^-?\d+(\.\d+)?$/.test(s);
}

function buildValidatedPayload(form) {
  const errors = {};
  const payload = {};

  for (const { key, label } of FIELD_META) {
    const raw = String(form[key] ?? "").trim();
    if (!raw) {
      errors[key] = `${label} is required`;
      continue;
    }
    if (!isNumericString(raw)) {
      errors[key] = `${label} must be a number`;
      continue;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      errors[key] = `${label} must be a valid number`;
      continue;
    }
    payload[key] = num;
  }

  return { ok: Object.keys(errors).length === 0, errors, payload };
}

export function PredictionForm({ value, onChange, onSubmit, isLoading }) {
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const hasAnyError = Object.keys(fieldErrors).length > 0;

  function setField(key, nextValue) {
    onChange((prev) => ({ ...prev, [key]: nextValue }));
  }

  function markTouched(key) {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }

  function validateLive(nextForm) {
    const { errors } = buildValidatedPayload(nextForm);
    // only show errors after touch
    const visible = {};
    for (const k of Object.keys(errors)) {
      if (touched[k]) visible[k] = errors[k];
    }
    setFieldErrors(visible);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { ok, errors, payload } = buildValidatedPayload(value);
    setTouched(Object.fromEntries(FIELD_META.map(({ key }) => [key, true])));
    setFieldErrors(errors);
    if (!ok) return;
    await onSubmit(payload);
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="grid">
        {FIELD_META.map(({ key, label, placeholder, step }) => {
          const error = fieldErrors[key];
          return (
            <div className={`field ${key === "Backlogs" ? "fieldSpan2" : ""}`} key={key}>
              <label className="label" htmlFor={key}>
                {label} <span className="req">*</span>
              </label>
              <input
                id={key}
                name={key}
                className={`input ${error ? "inputError" : ""}`}
                inputMode="decimal"
                type="number"
                step={step ?? "any"}
                autoComplete="off"
                placeholder={placeholder}
                value={value[key]}
                onBlur={() => {
                  markTouched(key);
                  validateLive(value);
                }}
                onChange={(e) => {
                  const next = e.target.value;
                  setField(key, next);
                  if (touched[key]) validateLive({ ...value, [key]: next });
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${key}-error` : undefined}
              />
              {error ? (
                <div className="fieldError" id={`${key}-error`}>
                  {error}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button className="btnPrimary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="btnRow">
              <LoadingSpinner />
              Predicting…
            </span>
          ) : (
            "Predict"
          )}
        </button>

        <button
          className="btnGhost"
          type="button"
          disabled={isLoading}
          onClick={() => {
            onChange(() => {
              const cleared = {};
              for (const { key } of FIELD_META) cleared[key] = "";
              return cleared;
            });
            setTouched({});
            setFieldErrors({});
          }}
        >
          Reset
        </button>

        <div className={`hint ${hasAnyError ? "hintWarn" : ""}`}>
          {hasAnyError ? "Fix the highlighted fields to continue." : "All inputs must be numeric."}
        </div>
      </div>
    </form>
  );
}

