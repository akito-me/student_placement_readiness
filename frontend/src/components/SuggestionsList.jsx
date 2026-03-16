import { LoadingSpinner } from "./LoadingSpinner.jsx";

export function SuggestionsList({ suggestions, isLoading }) {
  const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <div className="cardTitle">Suggestions</div>
          <div className="cardHint">Personalized next steps based on the model output.</div>
        </div>
      </div>

      <div className="suggestionsBody">
        {isLoading ? (
          <div className="loadingRow">
            <LoadingSpinner />
            <div className="muted">Generating suggestions…</div>
          </div>
        ) : hasSuggestions ? (
          <ul className="list">
            {suggestions.map((s, idx) => (
              <li className="listItem" key={`${idx}-${String(s).slice(0, 20)}`}>
                <span className="bullet" aria-hidden="true" />
                <span className="listText">{String(s)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">
            No suggestions returned yet. Submit the form, or update your inputs and predict again.
          </div>
        )}
      </div>
    </div>
  );
}

