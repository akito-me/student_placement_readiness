import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state;
    if (state && state.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.state]);

  function goToPredict() {
    navigate("/predict");
  }

  return (
    <main className="homePage">
      <section className="heroSection" id="hero">
        <div className="heroGrid">
          <div className="heroText">
            <div className="heroKicker">Academic mini-product • ML + Web</div>
            <h1 className="heroHeading">Placement Prediction System</h1>
            <p className="heroLead">
              A machine learning based system that predicts student placement readiness and provides
              improvement suggestions based on academic, skill, and profile-related features.
            </p>
            <div className="heroButtons">
              <button type="button" className="btnPrimary" onClick={goToPredict}>
                Try Prediction
              </button>
              <button
                type="button"
                className="btnGhost"
                onClick={() => {
                  const el = document.getElementById("about");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="heroPreview" aria-hidden="true">
            <div className="previewCard">
              <div className="previewTitle">What you’ll get</div>
              <ul className="previewList">
                <li>Placement prediction (Likely / Not likely)</li>
                <li>Probability percentage</li>
                <li>How-to-improve suggestions</li>
                <li>Charts for Prediction </li>
              </ul>
            </div>
            <div className="previewGlow" />
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="sectionHeader">
          <h2 className="sectionTitle">About</h2>
          <p className="sectionSubtitle">
            Understand placement readiness and the areas to improve before campus recruitment.
            Many students are unsure how placement-ready they are and which areas they should focus on.
            This project estimates placement readiness using academic and skill-based inputs and provides
            improvement suggestions.
          </p>
        </div>
        <div className="sectionBody">
          <p>
            
          </p>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="sectionHeader">
          <h2 className="sectionTitle">How it works</h2>
          <p className="sectionSubtitle">A simple end-to-end flow from input to prediction.</p>
        </div>

        <div className="stepsFlow">
          {[
            {
              t: "Enter student details",
              d: "Fill in academic performance and skill indicators.",
            },
            {
              t: "Send data to backend",
              d: "Frontend sends the form data to the ML API.",
            },
            {
              t: "ML model predicts readiness",
              d: "Model calculates prediction and probability score.",
            },
            {
              t: "Show result & suggestions",
              d: "Dashboard displays output with improvement points.",
            },
          ].map((s, i) => (
            <div className="stepItem" key={s.t}>
              <div className="stepTop">
                <div className="stepNumber">{i + 1}</div>
                <div className="stepLine" aria-hidden="true" />
              </div>
              <div className="stepTitle">{s.t}</div>
              <div className="stepDesc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="features">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Key features</h2>
          <p className="sectionSubtitle">Focused features designed for clarity and presentation.</p>
        </div>
        <div className="featureGrid">
          {[
            { t: "Placement Prediction", d: "Binary prediction: likely placed or not likely placed." },
            { t: "Probability Score", d: "Percentage-based confidence for the prediction." },
            { t: "Personalized Suggestions", d: "Backend-generated improvement points." },
            { t: "Interactive Insights", d: "Charts for probability and skill radar analysis." },
          ].map((f) => (
            <div className="featureBox" key={f.t}>
              <div className="featureBoxTitle">{f.t}</div>
              <div className="featureBoxDesc">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaSection">
        <div className="ctaInner">
          <div>
            <div className="ctaTitle">Ready to test your profile?</div>
            <div className="ctaHint">Go to the prediction page and generate results instantly.</div>
          </div>
          <button type="button" className="btnPrimary" onClick={goToPredict}>
            Go to Prediction Page
          </button>
        </div>
      </section>

      <section className="section" id="team">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Team / Contact</h2>
          <p className="sectionSubtitle">Replace placeholders with your actual team details.</p>
        </div>
        <div className="teamGridClean">
          {[
            { name: "Team Member", role: "ML model & backend", dept: "Department / Class", email: "email@example.com" },
            { name: "Team Member", role: "Frontend & UI", dept: "Department / Class", email: "email@example.com" },
            { name: "Project Guide", role: "Faculty / Mentor", dept: "Department / College", email: "email@example.com" },
          ].map((m) => (
            <div className="teamCardClean" key={m.role}>
              <div className="teamName">{m.name}</div>
              <div className="teamMeta">{m.role}</div>
              <div className="teamMeta">{m.dept}</div>
              <div className="teamMeta">{m.email}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerGrid">
          <div>
            <div className="footerTitle">Placement Prediction System</div>
            <div className="footerText">Academic project website • React frontend • ML backend</div>
          </div>
          <div>
            <div className="footerTitle">Contact</div>
            <div className="footerText">team@example.com</div>
            <div className="footerText">Department / College (placeholder)</div>
          </div>
          <div>
            <div className="footerTitle">Presented by</div>
            <div className="footerText">Student team names (placeholder)</div>
            <div className="footerText">Guide/Faculty (placeholder)</div>
          </div>
        </div>
        <div className="footerBottom">
          <span className="mutedSmall">© {new Date().getFullYear()} • For academic use and demonstration.</span>
        </div>
      </footer>
    </main>
  );
}

