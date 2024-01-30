import React, { useState, useEffect } from 'react';
import { firestore, collection, getDocs } from '../config/firebase'; // Adjust the path accordingly
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css-importer';

const GSTTable = () => {
  const [selectedOption, setSelectedOption] = useState('Airlines');
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionName =
          selectedOption === 'Airlines' ? 'WorkspaceCred' : 'OtherCollection'; // Adjust as per your collection names
        const credsCol = collection(firestore, 'workspaces', 'BCG', 'TableData');
        const snapshot = await getDocs(credsCol);
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setRowData(newData);
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

  const handleEdit = (id) => {
    console.log('Edit button clicked for id:', id);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log('Delete button clicked for id:', id);
    // Add your delete logic here
  };

  const columnDefs = [
    { headerName: 'GSTIN', field: 'GSTIN' },
    { headerName: 'UserID', field: 'UserID' },
    { headerName: 'Password', field: 'Password' },
    { headerName: 'OTP Required', field: 'otp' },
    {
      headerName: 'Action',
      cellRenderer: ActionRenderer, // Use the name of the framework component
    },
  ];

  const frameworkComponents = {
    ActionRenderer: ActionRenderer,
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
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          animateRows={true} // Enable row animations
          rowSelection="multiple" // Enable row selection
          frameworkComponents={frameworkComponents}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

const ActionRenderer = (props) => {
  const { data, handleEdit, handleDelete } = props;
  return (
    <div>
      <button className="ag-icon-button" onClick={() => handleEdit(data.id)}>Edit</button>
      <button className="ag-icon-button" onClick={() => handleDelete(data.id)}>Delete</button>
    </div>
  );
};

export default GSTTable;
