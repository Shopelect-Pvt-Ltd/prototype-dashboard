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
import GSTCrud from './pages/GST/GSTCrud';
import GSTUpload from './pages/GST/GSTUpload';
import ExamplePage from './pages/GST/Example';
import AirlineCrud from './pages/Airlines/AirlineCrud';
import LufthansaCrud from './pages/Airlines/LufthansaCrud';
import MyGrid from './pages/Airlines/MetaTable';


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
  const excludedRoutes = ["/","/irn-table,","/FetchDataPage","/domainData","/gstin-data","/GSTCrud","/GSTUpload","/Example","/airlinecreds","/lufthansacreds","/MetaTable"];
  

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
        <Route path="/GSTCrud" element={<GSTCrud />} />
        <Route path="/GSTUpload" element={<GSTUpload />} />
        <Route path="/Example" element={<ExamplePage />} />
        <Route path="/airlinecreds" element={<AirlineCrud />} />/MetaTable
        <Route path="/lufthansacreds" element={<LufthansaCrud />} />
        <Route path="/MetaTable" element={<MyGrid />} />
      </Routes>
    </>
  );
};

export default App;
