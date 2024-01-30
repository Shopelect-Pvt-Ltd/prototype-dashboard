// NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../src/pages/css-importer'

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/scraperDashboard" className="nav-link">Scraper Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/Airlinedashboard" className="nav-link">Airline Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/gstdashboard" className="nav-link">GST Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/gsttable" className="nav-link">GST Table</Link>
        </li>
        <li className="nav-item">
          <Link to="/AirlineTable" className="nav-link">Airline Table</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
