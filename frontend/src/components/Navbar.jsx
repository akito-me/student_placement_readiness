import { NavLink, useLocation, useNavigate } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/" || location.pathname === "/home";

  function handleScrollOrNav(targetId) {
    if (!isHome) {
      navigate("/", { state: { scrollTo: targetId } });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="navShell">
      <div className="navInner">
        <button
          type="button"
          className="navBrand"
          onClick={() => {
            if (!isHome) navigate("/");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="navLogo" aria-hidden="true" />
          <span className="navTitle">Placement Prediction System</span>
        </button>

        <nav className="navLinks" aria-label="Main">
          <button type="button" className="navLink" onClick={() => handleScrollOrNav("hero")}>
            Home
          </button>
          <button type="button" className="navLink" onClick={() => handleScrollOrNav("about")}>
            About
          </button>
          <button type="button" className="navLink" onClick={() => handleScrollOrNav("how-it-works")}>
            How It Works
          </button>
          <button type="button" className="navLink" onClick={() => handleScrollOrNav("features")}>
            Key Features
          </button>
          <NavLink
            to="/predict"
            className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
          >
            Predict
          </NavLink>
          <button type="button" className="navLink" onClick={() => handleScrollOrNav("team")}>
            Team / Contact
          </button>
        </nav>

        <NavLink
          to="/predict"
          className={({ isActive }) => `navCta ${isActive ? "navCtaActive" : ""}`}
        >
          Try Prediction
        </NavLink>
      </div>
    </header>
  );
}

