import React from "react";
import "./global.css";
import Routes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
