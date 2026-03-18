export function SideNavigation({ onScroll }) {
  const items = [
    { id: "form", label: "Prediction Form" },
    { id: "results", label: "Results" },
    { id: "suggestions", label: "Suggestions" },
    { id: "graphs", label: "Graphs & Insights" },
  ];

  return (
    <nav className="sideNav" aria-label="Prediction sections">
      <div className="sideNavTitle">Quick Navigation</div>
      <ul className="sideNavList">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="sideNavLink"
              onClick={() => onScroll(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

