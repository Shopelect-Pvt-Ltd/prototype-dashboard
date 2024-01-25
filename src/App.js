// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Route
import Dashboard from './pages/homepage/Dashboard';
import ScraperDashboard from "./pages/Scrapers/ScraperDashboard";
import AirlineCredsDashboard from "./pages/Airlines/Airlinecredsdashboard";
import GSTDashboard from './pages/GST/GSTdashboard'
import GSTTable from "./pages/GST/GSTTable"
import AirlineTable from "./pages/Airlines/AirlineTable";
import LogsPage from '../src/pages/Airlines/LogsPage';
import LogsListPage from '../src/pages/Airlines/LogsList'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scraperDashboard" element={<ScraperDashboard />} />
        <Route path="/Airlinedashboard" element={<AirlineCredsDashboard />} />
        <Route path="/gstdashboard" element={<GSTDashboard />} />
        <Route path="/gsttable" element={<GSTTable />} />
        <Route path="/AirlineTable" element={<AirlineTable />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/logslist" element={<LogsListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
