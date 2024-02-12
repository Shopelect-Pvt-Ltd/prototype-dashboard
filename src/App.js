// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/homepage/Dashboard';
import ScraperDashboard from "./pages/Scrapers/ScraperDashboard";
import AirlineCredsDashboard from "./pages/Airlines/Airlinecredsdashboard";
import GSTDashboard from './pages/GST/GSTdashboard';
import GSTTable from "./pages/GST/GSTTable";
import AirlineTable from "./pages/Airlines/AirlineTable";
import LogsPage from '../src/pages/Airlines/LogsPage';
import LogsListPage from '../src/pages/Airlines/LogsList';
import NavBar from '../src/navbar'; // Import your NavBar component
import WorkspaceSelectionPage from "../src/pages/Airlines/WorkspaceSelectionPage"
import GSTTableCopy from './pages/GST/GSTTablecopy';
import IrnTable from './pages/irn'
import FetchDataPage from './pages/GST/GSTINPUT';
import DataPage from './pages/GST/DataPage'
import Domain from './pages/GST/Domain'; // Import the Domain component
import GSTIN from './pages/GST/GSTIN';

const App = () => {
  return (
    <Router>
      <div>
        <AppRoutes /> {/* Use a separate component for routes */}
      </div>
    </Router>
  );
};

const AppRoutes = () => {
  let location = useLocation();

  // Define routes where NavBar should not be displayed
  const excludedRoutes = ["/","/irn-table,","/FetchDataPage","/domainData","/gstin-data"];
  

  // Check if current location matches excluded routes
  const shouldRenderNavBar = !excludedRoutes.includes(location.pathname);

  return (
    <>
      {shouldRenderNavBar && <NavBar />} {/* Render NavBar conditionally */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scraperDashboard" element={<ScraperDashboard />} />
        <Route path="/Airlinedashboard" element={<AirlineCredsDashboard />} />
        <Route path="/gstdashboard" element={<GSTDashboard />} />
        <Route path="/GSTTableCopy" element={<GSTTableCopy />} />
        <Route path="/AirlineTable" element={<AirlineTable />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/logslist" element={<LogsListPage />} />
        <Route path="/SelectWorkspace" element={<WorkspaceSelectionPage />} />
        <Route path="/irn-table" element={<IrnTable />} />
        <Route path="/FetchDataPage" element={<FetchDataPage />} />
        <Route path="/Data" element={<DataPage />} />
        <Route path="/domainData" element={<Domain />} />
        <Route path="/gstin-data" element={<GSTIN />} />
      </Routes>
    </>
  );
};

export default App;
