import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import '../css-importer';
import EditAirline from './EditAirline';
import Popup from './popup';
import firebaseConfig from '../config/firebase';
import axios from 'axios';
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const AirlineTable = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newAirline, setNewAirline] = useState({
    airline_name: '',
    portal_id: '',
    last_ran: '',
    files_count: '',
    imap_url: '',
    portal_pass: '',
  });
  const [isAddNewFormOpen, setIsAddNewFormOpen] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false); // Track row selection
  const [gridApi, setGridApi] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deletingRowIndex, setDeletingRowIndex] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false); // Track progress bar visibility
  const [showRunAllButton, setShowRunAllButton] = useState(false); // Track Run All button visibility
  const [isRunButtonDisabled, setIsRunButtonDisabled] = useState(false); // Track Run button disabled state
  const [progressBarText, setProgressBarText] = useState('In Progress'); // Track progress bar text
  const [showSavedPopup, setShowSavedPopup] = useState(false); // Track saved pop-up visibility
  const [history, setHistory] = useState([]); // History of selected workspaces
  const [historyIndex, setHistoryIndex] = useState(-1); // Index of the current history entry
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows

  const navigate = useNavigate();

  const useQuery= () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();

  useEffect(() => {
    console.log("USE EFFECT CALLED -1")
    console.log("asertgfd", query.get("workspace"))
    if (query.get("workspace") != null || query.get("workspace") !== undefined )
    {
      setSelectedWorkspace(query.get("workspace"))
    }

    const fetchWorkspaces = async () => {
      try {
        const snapshot = await firestore.collection('cred_ls').get();
        const workspaceNames = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setWorkspaces(workspaceNames);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    console.log("USE EFFECT CALLED -2")
    const fetchTableData = async () => {
      try {
        if (selectedWorkspace) {
          const credsRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`);
          const snapshot = await credsRef.get();
  
          if (snapshot.empty) {
            console.warn('No data found for the selected workspace.');
            setTableData([]);
            return;
          }
  
          const allTableData = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            checked: false, // Checkbox state
          }));
  
          setTableData(allTableData);
        }
      } catch (error) {
        console.error('Error fetching table data: ', error);
      }
    };

    fetchTableData();
  }, [selectedWorkspace]);
  console.log("twerk ass bitch")
  const handleDropdownChange = (e) => {
    const { value } = e.target;
    setSelectedWorkspace(value);

    navigate({
      // pathname: `/logs`,
      search: `?${createSearchParams({
        workspace: `${value}`,
      })}`
    });

    setEditIndex(null);
    // Update URL with new workspace parameter
    // navigate(`/your-route-path/${value}`);

    // Update history when selecting a new workspace
    const newHistory = [...history.slice(0, historyIndex + 1), value];
    setHistory(newHistory);
    setHistoryIndex(historyIndex + 1);
  };

  const handleRun = async (index) => {
    let airlineData;
  
    try {
      setIsRunButtonDisabled(true);
      setProgressBarText('In Progress');
      setShowProgressBar(true);
  
      airlineData = tableData[index];
      const response = await Promise.race([
        axios.post('https://lufthansa-fn-sk7dyq62iq-uc.a.run.app', airlineData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('API Timeout')), 45000)
        ),
      ]);
  
      if (response) {
        console.log('API Response:', response.data);
        const updatedAirlineData = { ...airlineData };
        updatedAirlineData.Status = 'Active';
        await firestore.collection(`cred_ls/${selectedWorkspace}/creds`).doc(airlineData.id).update({ Status: 'Active' });
      } else {
        console.error('API request timed out.');
        const updatedAirlineData = { ...airlineData };
        updatedAirlineData.Status = 'Not Active';
        await firestore.collection(`cred_ls/${selectedWorkspace}/creds`).doc(airlineData.id).update({ Status: 'Not Active' });
      }
  
      setProgressBarText('Completed');
    } catch (error) {
      console.error('Error making API request:', error);
      const updatedAirlineData = { ...airlineData };
      updatedAirlineData.Status = 'Not Active';
      await firestore.collection(`cred_ls/${selectedWorkspace}/creds`).doc(airlineData.id).update({ Status: 'Not Active' });
      setProgressBarText('Invalid Credential'); // Update progress bar text
    } finally {
      setTimeout(() => {
        setShowProgressBar(false); // Close progress bar pop-up after 2 seconds regardless of success or failure
      }, 5000);
      setIsRunButtonDisabled(false);
    }
  };
  
  const handleRunAll = async () => {
    try {
      setIsRunButtonDisabled(true); // Disable the Run button
      setProgressBarText('In Progress'); // Set progress bar text to "In Progress"
      setShowProgressBar(true); // Show progress bar

      // Show confirmation dialog before running all
      const confirmed = window.confirm('Are you sure you want to run all selected rows?');
      if (!confirmed) {
        setIsRunButtonDisabled(false);
        setShowProgressBar(false);
        return;
      }
  
      // Iterate through selected rows and execute the run operation for each
      const selectedNodes = gridApi.getSelectedNodes();
      for (const node of selectedNodes) {
        const airlineData = node.data;
        console.log('ID:', airlineData.id); // Print ID of selected row
        console.log('Object:', airlineData); // Print ID of selected row
  
        // Similar logic as handleRun function to update "Status" field
        const response = await axios.post('https://lufthansa-fn-sk7dyq62iq-uc.a.run.app', airlineData);
        const updatedStatus = response ? 'Active' : 'Not Active';
  
        // Update Firestore document with the new "Status" field
        await firestore.collection(`cred_ls/${selectedWorkspace}/creds`).doc(airlineData.id).update({ Status: updatedStatus });
      }
  
      console.log('All selected rows have been processed.');
  
      // Update progress bar text to "Completed"
      setProgressBarText('Completed');
      // Close the popup after 2 seconds when it shows "Completed"
      setTimeout(() => {
        setShowProgressBar(false);
      }, 2000);
    } catch (error) {
      console.error('Error running all selected rows:', error);
    } finally {
      setIsRunButtonDisabled(false); // Enable the Run button
      // No need to hide the progress bar here
    }
  };

  const handleEdit = (index) => {
    handleSelectionChanged();
    setEditIndex(index);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  const handleSaveEdit = async (editedAirline) => {
    try {
      const airlineCredsRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`).doc(editedAirline.id);
      const docSnapshot = await airlineCredsRef.get();

      if (!docSnapshot.exists) {
        console.error('Document does not exist:', editedAirline.id);
        return;
      }

      await airlineCredsRef.update(editedAirline);

      const updatedTableData = tableData.map((item, i) => (i === editIndex ? editedAirline : item));
      setTableData(updatedTableData);

      setEditIndex(null);
      setShowSavedPopup(true); // Show the saved pop-up
      setTimeout(() => setShowSavedPopup(false), 3000); // Hide the pop-up after 3 seconds
    } catch (error) {
      console.error('Error updating data in Firestore:', error);
    }
  };

  const handleLogs = (airline, index) => {
    console.log("Index", index, airline)
    navigate({
      pathname: `/logsList`,
      search: `?${createSearchParams({
        workspace: `${airline.workspace}`,
        workspace_id: `${airline.id}`

      })}`
    });
  };

  const handleDelete = async (index) => {
    setDeletingRowIndex(index);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const airlineToDelete = tableData[deletingRowIndex];
      const panRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`);
      const airlineCredsRef = panRef.doc(airlineToDelete.id);

      await airlineCredsRef.delete();

      const updatedTableData = tableData.filter((item, i) => i !== deletingRowIndex);
      setTableData(updatedTableData);

      setDeleteConfirmationVisible(false);
      setDeletingRowIndex(null);
    } catch (error) {
      console.error('Error deleting data from Firestore:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setDeletingRowIndex(null);
  };

  const handleNewAirlineChange = (e) => {
    const { name, value } = e.target;
    setNewAirline((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddNewClick = () => {
    setIsAddNewFormOpen(true);
  };

  const handleSaveNew = async () => {
    try {
      if (!newAirline.airline_name || !newAirline.portal_id || !newAirline.last_ran || !newAirline.files_count || !newAirline.imap_url || !newAirline.portal_pass) {
        console.error('Please enter all required fields.');
        return;
      }

      const panRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`);
      const newAirlineDocRef = await panRef.add(newAirline);

      setNewAirline({
        ...newAirline,
        id: newAirlineDocRef.id,
        checked: false, // Add checkbox state
      });

      const updatedTableData = [...tableData, newAirline];
      setTableData(updatedTableData);

      setNewAirline({
        airline_name: '',
        portal_id: '',
        last_ran: '',
        files_count: '',
        imap_url: '',
        portal_pass: '',
      });

      setIsAddNewFormOpen(false);
      setShowSavedPopup(true); // Show the saved pop-up
      setTimeout(() => setShowSavedPopup(false), 3000); // Hide the pop-up after 3 seconds
    } catch (error) {
      console.error('Error adding new data:', error);
    }
  };

  const handleCancelNew = () => {
    setNewAirline({
      airline_name: '',
      portal_id: '',
      last_ran: '',
      files_count: '',
      imap_url: '',
      portal_pass: '',
    });

    setIsAddNewFormOpen(false);
  };

  const handleSelectionChanged = () => {
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      setSelectedRows(selectedData);
      setIsRowSelected(selectedNodes.length > 0);
      console.log('a', selectedNodes);
      setShowRunAllButton(selectedNodes.length > 1); // Show Run All button if more than one row is selected
    }
  };

  const columnDefs = [
    { headerCheckboxSelection: isRowSelected, checkboxSelection: isRowSelected, width: 50},
    { headerName: 'Airline Name', field: 'airline_name'},
    { headerName: 'Portal ID', field: 'portal_id' },
    { headerName: 'Last Ran', field: 'last_ran' },
    { headerName: 'Files Count', field: 'files_count' },
    { headerName: 'Imap URL', field: 'imap_url' },
    { headerName: 'Portal Pass', field: 'portal_pass' },
    { headerName: 'Status', field: 'Status'}, // New Status column
    {
      headerName: 'Actions', colId: 'id',
      cellRenderer: (params) => (
        <div>
          <button className="ag-icon-button" onClick={() => handleEdit(params.rowIndex)}>Edit</button>
          <button className="ag-icon-button" onClick={() => handleDelete(params.rowIndex)}>Delete</button>
          <button className={`ag-icon-button ${isRunButtonDisabled ? 'run-button-disabled' : 'run-button'}`} onClick={() => handleRun(params.rowIndex)} disabled={isRunButtonDisabled}> Run </button>
          <button className="ag-icon-button" onClick={() => handleLogs(params.data, params.rowIndex)}>Logs</button>
        </div>
      ),
    },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Workspace Selector</h1>
      <label>Select Workspace: </label>
      <select onChange={handleDropdownChange} value={selectedWorkspace}>
        <option value="">Select a workspace</option>
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>

      {selectedWorkspace && (
        <>
          <button onClick={handleAddNewClick}>Add New</button>
          {showRunAllButton && <button onClick={handleRunAll}>Run All</button>}
        </>
      )}

      {editIndex !== null && (
        <Popup onClose={handleCancelEdit}>
          <EditAirline
            editingAirline={tableData[editIndex]}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </Popup>
      )}

      {isAddNewFormOpen && (
        <Popup onClose={handleCancelNew}>
          <div className="popup-form">
            <h2>Add New Airline</h2>
            <label>Airline Name:</label>
            <input
              type="text"
              name="airline_name"
              value={newAirline.airline_name}
              onChange={handleNewAirlineChange}
            />
            <label>Portal ID:</label>
            <input
              type="text"
              name="portal_id"
              value={newAirline.portal_id}
              onChange={handleNewAirlineChange}
            />
            <label>Last Ran:</label>
            <input
              type="text"
              name="last_ran"
              value={newAirline.last_ran}
              onChange={handleNewAirlineChange}
            />
            <label>Files Count:</label>
            <input
              type="text"
              name="files_count"
              value={newAirline.files_count}
              onChange={handleNewAirlineChange}
            />
            <label>Imap URL:</label>
            <input
              type="text"
              name="imap_url"
              value={newAirline.imap_url}
              onChange={handleNewAirlineChange}
            />
            <label>Portal Pass:</label>
            <input
              type="text"
              name="portal_pass"
              value={newAirline.portal_pass}
              onChange={handleNewAirlineChange}
            />
            <div>
              <button onClick={handleSaveNew}>Save</button>
              <button onClick={handleCancelNew}>Cancel</button>
            </div>
          </div>
        </Popup>
      )}

      {deleteConfirmationVisible && (
              <>
                {/* Overlay */}
                <div className="delete-overlay"></div>

                {/* Delete confirmation popup */}
                <div className="delete">
                  <h2>Confirm Deletion</h2>
                  <p>Are you sure you want to delete?</p>
                  <div>
                    <button onClick={confirmDelete}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                  </div>
                </div>
              </>
            )}

          {showProgressBar && (
            <div className="progress-overlay"> {/* Add progress overlay */}
              <div className="progress-popup" id="progressPopup">
                <div className="progress-text" id="progressText">{progressBarText}</div>
                <div className="progress-bar">
                  <div className="progress-bar-inner"></div>
                  <div className="running-bar"></div>
                </div>
              </div>
            </div>
          )}

      {showSavedPopup && <div className="popup">Saved</div>}

      {selectedWorkspace && (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            animateRows={true}
            rowSelection="multiple"
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={10}
            domLayout='autoHeight'
            columnDefs={columnDefs}
            rowData={tableData}
            onSelectionChanged={handleSelectionChanged}
            // onCellClicked={handleSelectionChanged}
            // rowMultiSelectWithClick={true}
          />
        </div>
      )}
    </div>
  );
};

export default AirlineTable;
