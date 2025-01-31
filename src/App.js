import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VisaForm from "../src/components/VisaForm";
import ResumeUpload from "../src/components/ResumeUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VisaForm />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
