import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import '../css-importer';
import EditAirline from './EditAirline'; // Import the new component
import firebaseConfig from '../config/firebase'
import Popup from './popup';


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

  useEffect(() => {
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
            id: doc.id,  // changes made here for edit functinality issues
          }));

          setTableData(allTableData);
        }
      } catch (error) {
        console.error('Error fetching table data: ', error);
      }
    };

    fetchTableData();
  }, [selectedWorkspace]);

  const handleDropdownChange = (e) => {
    setSelectedWorkspace(e.target.value);
    setEditIndex(null); // Reset editIndex when workspace changes
  };

  const handleEdit = (index) => {
    console.log("HANDLE EDIT:", index);
    setEditIndex(index);
  };

  const handleCancelEdit = () => {
    // Reset editIndex
    setEditIndex(null);
  };

  const handleSaveEdit = async (editedAirline) => {
    try {
      // Reference to the Firestore document to be updated
      const airlineCredsRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`).doc(editedAirline.id);

      console.log("HANDLE SAVE EDIT", editedAirline);
      // Check if the document exists before updating
      const docSnapshot = await airlineCredsRef.get();

      if (!docSnapshot.exists) {
        console.error('Document does not exist:', editedAirline.id);
        // Handle the situation where the document doesn't exist
        return;
      }

      // Update the Firestore document with the edited data
      await airlineCredsRef.update(editedAirline);

      // Update the edited airline data in the tableData array
      const updatedTableData = tableData.map((item, i) => (i === editIndex ? editedAirline : item));
      setTableData(updatedTableData);

      // Reset editIndex
      setEditIndex(null);
    } catch (error) {
      console.error('Error updating data in Firestore:', error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const airlineToDelete = tableData[index];
      const panRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`);
      const airlineCredsRef = panRef.doc(airlineToDelete.id);

      await airlineCredsRef.delete();

      // Remove the airline from the tableData array
      const updatedTableData = tableData.filter((item, i) => i !== index);
      setTableData(updatedTableData);
    } catch (error) {
      console.error('Error deleting data from Firestore:', error);
    }
  };

  const handleNewAirlineChange = (e) => {
    const { name, value } = e.target;
    setNewAirline((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddNewClick = () => {
    // Open the add new form
    setIsAddNewFormOpen(true);
  };

  const handleSaveNew = async () => {
    try {
      // Validate new data (you can add more validation as needed)
      if (!newAirline.airline_name || !newAirline.portal_id || !newAirline.last_ran || !newAirline.files_count || !newAirline.imap_url || !newAirline.portal_pass) {
        console.error('Please enter all required fields.');
        return;
      }

      const panRef = firestore.collection(`cred_ls/${selectedWorkspace}/creds`);
      const newAirlineDocRef = await panRef.add(newAirline);

      // Update the new airline's local state with the generated ID
      setNewAirline({
        ...newAirline,
        id: newAirlineDocRef.id,
      });

      // Add the new airline to the tableData array
      const updatedTableData = [...tableData, newAirline];
      setTableData(updatedTableData);

      // Reset the new airline form
      setNewAirline({
        airline_name: '',
        portal_id: '',
        last_ran: '',
        files_count: '',
        imap_url: '',
        portal_pass: '',
      });

      // Close the add new form
      setIsAddNewFormOpen(false);
    } catch (error) {
      console.error('Error adding new data:', error);
    }
  };

  const handleCancelNew = () => {
    // Reset the new airline form
    setNewAirline({
      airline_name: '',
      portal_id: '',
      last_ran: '',
      files_count: '',
      imap_url: '',
      portal_pass: '',
    });

    // Close the add new form
    setIsAddNewFormOpen(false);
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
          <div>
            <h2>Add New Airline</h2>
            {/* Your existing code for the add new form */}
            <button onClick={handleSaveNew}>Save</button>
            <button onClick={handleCancelNew}>Cancel</button>
          </div>
        </Popup>
      )}

      {selectedWorkspace && (
        <div>
          <button onClick={handleAddNewClick}>Add New</button>

          {isAddNewFormOpen && (
            <div>
              <h2>Add New Airline</h2>
              <label>Airline Name:</label>
              <input
                type="text"
                name="airline_name"
                value={newAirline.airline_name}
                onChange={handleNewAirlineChange}
              />
              {/* Add input fields for other properties as needed */}
              <label>Portal ID:</label>
              <input
                type="text"
                name="portal_id"
                value={newAirline.portal_id}
                onChange={handleNewAirlineChange}
              />
              {/* Add input fields for other properties as needed */}
              <label>Last Ran:</label>
              <input
                type="text"
                name="last_ran"
                value={newAirline.last_ran}
                onChange={handleNewAirlineChange}
              />
              {/* Add input fields for other properties as needed */}
              <label>Files Count:</label>
              <input
                type="text"
                name="files_count"
                value={newAirline.files_count}
                onChange={handleNewAirlineChange}
              />
              {/* Add input fields for other properties as needed */}
              <label>Imap URL:</label>
              <input
                type="text"
                name="imap_url"
                value={newAirline.imap_url}
                onChange={handleNewAirlineChange}
              />
              {/* Add input fields for other properties as needed */}
              <label>Portal Pass:</label>
              <input
                type="text"
                name="portal_pass"
                value={newAirline.portal_pass}
                onChange={handleNewAirlineChange}
              />

              <button onClick={handleSaveNew}>Save</button>
              <button onClick={handleCancelNew}>Cancel</button>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Airline Name</th>
                <th>Portal ID</th>
                <th>Last Ran</th>
                <th>Files Count</th>
                <th>Imap URL</th>
                <th>Portal Pass</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((airline, index) => (
                <tr key={index}>
                  <td>{airline.airline_name}</td>
                  <td>{airline.portal_id}</td>
                  <td>{airline.last_ran}</td>
                  <td>{airline.files_count}</td>
                  <td>{airline.imap_url}</td>
                  <td>{airline.portal_pass}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                    <button onClick={() => handleDelete(index)}>Run</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AirlineTable;
