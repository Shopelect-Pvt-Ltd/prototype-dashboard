// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change 'Switch' to 'Routes'
import Dashboard from './pages/homepage/Dashboard';
import ScraperDashboard from "./pages/Scrapers/ScraperDashboard";
import AirlineCredsDashboard from "./pages/Airlines/Airlinecredsdashboard";
import GSTDashboard from './pages/GST/GSTdashboard'
import GSTTable from "./pages/GST/GSTTable"
import AirlineTable from "./pages/Airlines/AirlineTable";
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <Routes> {/* Change 'Switch' to 'Routes' */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/scraperDashboard" element={<ScraperDashboard/>} />
        <Route path="/Airlinedashboard" element={<AirlineCredsDashboard />} />
        <Route path="/gstdashboard" element={<GSTDashboard />} />
        <Route path="/gsttable" element={<GSTTable />} />
        <Route path="/AirlineTable" element={<AirlineTable />} />
      </Routes> {/* Change 'Switch' to 'Routes' */}
    </Router>
  );
};

export default App;
