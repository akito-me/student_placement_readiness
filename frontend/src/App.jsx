import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { Home } from "./pages/Home.jsx";
import { Predict } from "./pages/Predict.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;