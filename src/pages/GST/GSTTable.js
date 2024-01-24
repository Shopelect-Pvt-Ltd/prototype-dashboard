import React, { useState, useEffect } from 'react';
import { firestore, collection, getDocs } from '../config/firebase'; // Adjust the path accordingly
import './GSTTable.css';

const GSTTable = () => {
  const [selectedOption, setSelectedOption] = useState('Airlines');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionName = 
          selectedOption === 'workspaces' ? 'Data ' : 'WorkspaceCred';
          const credsCol = collection(firestore, 'workspaces', 'BCG', 'TableData',);
        const snapshot = await getDocs(credsCol);
        const newData = snapshot.docs.map((doc) => doc.data());
        setData(newData);
        console.log('Data fetched successfully:', newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedOption]);

  const handleClientChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="dashboard-container">
      <h1>GST CREDENTIAL TABLE</h1>
      <div>
        <label>Select Client:</label>
        <select value={selectedOption} onChange={handleClientChange}>
          <option value="Airlines">Airlines</option>
          {/* Add other client options as needed */}
        </select>
      </div>
      <button>Add New</button>
      <table>
        <thead>
          <tr>
            <th>GSTIN</th>
            <th>UserID</th>
            <th>Password</th>
            <th>OTP Required</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.GSTIN}</td>
                <td>{item.UserID}</td>
                <td>{item.Password}</td>
                <td>{item.otp}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
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

export default GSTTable;