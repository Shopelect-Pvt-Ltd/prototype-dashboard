// src/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <div className="logo-container">
        <img className="logo" src={process.env.PUBLIC_URL + '/Finkraft_Logo.jpeg'} alt="Company Logo" />
      </div>
      <h1>INDEX Dashboard</h1>
      <div>
        {/* <a href="/scraperDashboard">Scraper Dashboard         <button>View</button></a> */}
        <Row title="Scrapper Dashboard" path="/scraperDashboard" />
        <Row title="Airline Credential Dashboard" path="/Airlinedashboard" />
        <Row title="GST Credential Dashboard" path="/gstdashboard" />
        <Row title="GST Credential Table" path="/gsttable" />
        <Row title="Airline Credentials Table" path="/AirlineTable" />
      </div>
    </div>
  );
};

const Row = ({ title, path }) => {
  return (
    <div>
      <p>{title}</p>
      <Link to={path}>
        <button>View</button>
      </Link>
    </div>
  );
};

export default Dashboard;
