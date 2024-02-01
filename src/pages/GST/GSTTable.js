import React, { useState, useEffect } from 'react';
import { firestore, collection, getDocs } from '../config/firebase';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css-importer';

const GSTTable = () => {
  const [selectedOption, setSelectedOption] = useState('Airlines');
  const [rowData, setRowData] = useState([]);
  const [isRowSelected, setIsRowSelected] = useState(false); // Track row selection
  const [gridApi, setGridApi] = useState(null); // Define gridApi state
  const [gridColumnApi, setGridColumnApi] = useState(null); // Define gridColumnApi state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionName =
          selectedOption === 'Airlines' ? 'WorkspaceCred' : 'OtherCollection';
        const credsCol = collection(firestore, 'workspaces', 'BCG', 'TableData');
        const snapshot = await getDocs(credsCol);
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          checked: false,
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
  };

  const handleDelete = (id) => {
    console.log('Delete button clicked for id:', id);
  };

  const handleCheckboxChange = (event, id) => {
    const { checked } = event.target;
    setRowData(prevState =>
      prevState.map(row =>
        row.id === id ? { ...row, checked } : row
      )
    );
  };

  const handleSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    setIsRowSelected(selectedNodes.length > 0);
  };

  const columnDefs = [
    { headerCheckboxSelection: isRowSelected, checkboxSelection: isRowSelected, width: 50 },
    { headerName: 'GSTIN', field: 'GSTIN' },
    { headerName: 'UserID', field: 'UserID' },
    { headerName: 'Password', field: 'Password' },
    { headerName: 'OTP Required', field: 'otp' },
    {
      headerName: 'Action',
      cellRenderer: 'ActionRenderer',
      width: 100
    },
  ];

  const frameworkComponents = {
    ActionRenderer: ActionRenderer,
  };

  const onGridReady = (params) => {
    setGridApi(params.api); // Set gridApi when grid is ready
    setGridColumnApi(params.columnApi); // Set gridColumnApi when grid is ready
  };

  return (
    <div className="dashboard-container">
      <h1>GST CREDENTIAL TABLE</h1>
      <div>
        <label>Select Client:</label>
        <select value={selectedOption} onChange={handleClientChange}>
          <option value="Airlines">Airlines</option>
        </select>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          animateRows={true}
          rowSelection="multiple"
          frameworkComponents={frameworkComponents}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          onSelectionChanged={handleSelectionChanged}
          onGridReady={onGridReady}
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
