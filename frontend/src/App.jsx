import { useState } from "react";

function App() {

  const [formData, setFormData] = useState({
    Age: "",
    Branch: "",
    CGPA: "",
    Internships: "",
    Projects: "",
    Coding_Skills: "",
    Communication_Skills: "",
    Aptitude_Test_Score: "",
    Soft_Skills_Rating: "",
    Certifications: "",
    Backlogs: ""
  });

  const [result, setResult] = useState(null);
const [probability, setProbability] = useState(null);
const [suggestions,setSuggestions] = useState([]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  setResult(data.prediction);
  setProbability((data.probability * 100).toFixed(2));
  setSuggestions(data.suggestions || []);
};

  return (
    <div style={{padding:"40px"}}>
      <h1>Placement Prediction System</h1>

      <form onSubmit={handleSubmit}>

        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <input
              type="number"
              name={key}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit">Predict</button>
      </form>

     {result !== null && (
  <div>
    <h2>
      Prediction: {result === 1 ? "Likely Placed" : "Not Likely Placed"}
    </h2>

    <h3>
      Placement Probability: {probability}%
    </h3>
      <h4>Suggestions:</h4>
<ul>
  {suggestions.map((s, idx) => (
    <li key={idx}>{s}</li>
  ))}
</ul>
  </div>
)}

    </div>
  );
}

export default App;