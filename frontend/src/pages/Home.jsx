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
              ML-based student placement readiness prediction with smart improvement suggestions.
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
                <li>Charts & insights</li>
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
            This project helps students estimate placement readiness.
            It analyzes academic and skill-based inputs.
            It also provides suggestions for improvement.
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
              t: "Enter details",
              d: "Add academic and skill inputs.",
            },
            {
              t: "Send data",
              d: "Form data goes to the backend.",
            },
            {
              t: "Predict result",
              d: "ML model evaluates readiness.",
            },
            {
              t: "View insights",
              d: "See probability and suggestions.",
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
            { t: "Placement Prediction", d: "Predicts likely placement outcome." },
            { t: "Probability Score", d: "Shows placement confidence." },
            { t: "Suggestions", d: "Provides improvement tips." },
            { t: "Interactive Charts", d: "Visualizes readiness insights." },
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
          <p className="sectionSubtitle">Names, roles, and contact.</p>
        </div>
        <div className="teamGridClean">
          {[
            { name: "TADVAB PRADHAN", role: "202320516", email: "tadvabpradhan2005@gmail.com" },
            { name: "AMRIT PRIYADARSHI SWAIN", role: "202320471", email: "amritpriyadarshiswain15@gmail.com" },
            { name: "DISHA RANI DASH", role: "202321517", email: "dishadash11@gmail.com" },
            { name: "BIBEK LENKA", role: "202320512", email: "bibeklenka2003@gmail.com" },
            { name: "DEBASISH PADHY", role: "Faculty / Mentor", email: "" },
          ].map((m) => (
            <div className="teamCardClean" key={m.role}>
              <div className="teamName">{m.name}</div>
              <div className="teamMeta">{m.role}</div>
              <div className="teamMeta">{m.email}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerGrid">
          <div>
            <div className="footerTitle">Placement Prediction System</div>
            <div className="footerText">Academic project • React + ML</div>
          </div>
          <div>
            <div className="footerTitle">Contact</div>
            <div className="footerText">tadvabpradhan2005@gmail.com</div>
          </div>
          <div>
            <div className="footerTitle">Presented by</div>
            <div className="footerText">team placement</div>
          </div>
        </div>
        <div className="footerBottom">
          <span className="mutedSmall">© {new Date().getFullYear()} • For academic use and demonstration.</span>
        </div>
      </footer>
    </main>
  );
}

