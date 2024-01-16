import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { firestore, collection, getDocs } from './firebase'; // Import the firestore instance
import './gstdashboard.css';

const GSTDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Airlines');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionName = selectedOption === 'Airlines' ? 'workspaces' : 'WorkspaceCred';
        console.log(collectionName);
        const credsCol = collection(firestore, collectionName);
        const snapshot = await getDocs(credsCol);
        const newData = snapshot.docs.map(doc => doc.data());
        setData(newData);
        console.log('Data fetched successfully:', newData); // Add this line
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedOption]);

  return (
    <div className="dashboard-container">
      <h1>GST Credentials Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>PAN </th>
            <th>GSTIN</th>
            <th>Active Credentials</th>
            <th>Invalid Credentials</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.total_pan}</td>
                <td>{item.total_gstin}</td>
                <td>{item.active_cred}</td>
                <td>{item.invalid_cred}</td>
                <td>
                  <Link to="/details">View Details</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GSTDashboard;
