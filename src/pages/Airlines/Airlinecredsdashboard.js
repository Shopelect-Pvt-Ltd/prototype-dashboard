import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore, collection, getDocs } from '../config/firebase'; // Import the firestore instance
import '../css-importer';

const AirlineCredsDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Airlines');
  const [data, setData] = useState([]);

  const handleToggleChange = () => {
    setSelectedOption((prevOption) =>
      prevOption === 'Airlines' ? 'Workspace' : 'Airlines'
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionName = selectedOption === 'Airlines' ? 'AirlinesCred' : 'WorkspaceCred';
        const credsCol = collection(firestore, collectionName);
        const snapshot = await getDocs(credsCol);
        const newData = snapshot.docs.map(doc => doc.data());
        setData(newData);
        console.log('Data fetched successfully:', newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [selectedOption]);

  return (
    <div className="dashboard-container">
      <h1>{selectedOption === 'Airlines' ? 'Airlines' : 'Workspaces'} Credential Dashboard</h1>
      <div className="toggle-container">
        <span className="toggle-label">
          {selectedOption === 'Airlines' ? 'Airlines' : 'Workspace'}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={selectedOption === 'Workspace'}
            onChange={handleToggleChange}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number of Pans</th>
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
                <td>{item.pans}</td>
                <td>{item.ActiveCredentials}</td>
                <td>{item.invalidCredentials}</td>
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

export default AirlineCredsDashboard;
