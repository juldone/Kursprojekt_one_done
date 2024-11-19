import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./../../frontend/src/components/Account.js";
import Fight from "./../../frontend/src/components/Fight.js"; // Beispiel für eine mögliche Fight-Komponente

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Deine anderen Routen */}
        <Route path="/user/:accountId" element={<Account />} />
        <Route path="/Fight" element={<Fight />} />{" "}
        {/* Route für die Fight-Seite */}
      </Routes>
    </Router>
  );
};

export default App;
