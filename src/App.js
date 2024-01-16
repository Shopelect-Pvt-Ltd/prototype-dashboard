// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change 'Switch' to 'Routes'
import Dashboard from './components/Dashboard';
import ScraperDashboard from './components/ScraperDashboard';
import AirlineCredsDashboard from './components/Airlinecredsdashboard';
import GSTDashboard from './components/GSTdashboard'
import GSTTable from './components/GSTTable'
import AirlineTable from "./components/AirlineTable";
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <Routes> {/* Change 'Switch' to 'Routes' */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/scraperdashboard" element={<ScraperDashboard />} />
        <Route path="/Airlinedashboard" element={<AirlineCredsDashboard />} />
        <Route path="/gstdashboard" element={<GSTDashboard />} />
        <Route path="/gsttable" element={<GSTTable />} />
        <Route path="/AirlineTable" element={<AirlineTable />} />
      </Routes> {/* Change 'Switch' to 'Routes' */}
    </Router>
  );
};

export default App;
