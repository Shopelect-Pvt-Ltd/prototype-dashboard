// src/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>INDEX Dashboard</h1>
      <div>
        <Row title="Scrapper Dashboard" path="/scraperdashboard" />
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
