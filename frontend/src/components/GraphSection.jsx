export function GraphSection() {
  const features = [
    { name: "CGPA", value: 0.9 },
    { name: "Coding Skills", value: 0.85 },
    { name: "Projects", value: 0.8 },
    { name: "Aptitude Score", value: 0.75 },
    { name: "Certifications", value: 0.6 },
    { name: "Communication", value: 0.55 },
    { name: "Backlogs (negative)", value: 0.7 },
  ];

  return (
    <section className="card" id="graphs">
      <div className="cardHeader">
        <div>
          <div className="cardTitle">Model Insights (Static Example)</div>
          <div className="cardHint">
            These visuals illustrate which factors typically influence placement readiness.
          </div>
        </div>
      </div>

      <div className="graphsGrid">
        <div className="graphBlock">
          <div className="graphTitle">Feature importance (example)</div>
          <div className="bars">
            {features.map((f) => (
              <div className="barRow" key={f.name}>
                <span className="barLabel">{f.name}</span>
                <div className="barTrack">
                  <div
                    className={`barFill ${
                      f.name.includes("Backlogs") ? "barFillNegative" : "barFillPositive"
                    }`}
                    style={{ width: `${f.value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="graphBlock">
          <div className="graphTitle">Readiness factors</div>
          <div className="factorCards">
            <div className="factorCard">
              <div className="factorTitle">Academic Strength</div>
              <p>CGPA, backlogs, and consistency strongly impact first-level shortlisting.</p>
            </div>
            <div className="factorCard">
              <div className="factorTitle">Technical Skills</div>
              <p>Coding skills, projects, and internships demonstrate hands-on ability.</p>
            </div>
            <div className="factorCard">
              <div className="factorTitle">Communication & Aptitude</div>
              <p>Communication skills and aptitude scores matter a lot in interviews.</p>
            </div>
            <div className="factorCard">
              <div className="factorTitle">Certifications & Extra Effort</div>
              <p>Relevant certifications and extra courses can give you an edge.</p>
            </div>
          </div>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Note: These charts are for presentation and explanation only. Actual model behaviour depends on
        the dataset and training configuration used in the backend.
      </p>
    </section>
  );
}

