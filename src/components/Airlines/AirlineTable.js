import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './AirlineTable.css';
import EditAirline from './EditAirline'; // Import the new component

// Initialize Firebase (Make sure to replace these config values with your own)
const firebaseConfig = {
  apiKey: "AIzaSyD33JyUFjugVISjRu_yElDamtvR0-6tBlU",
  authDomain: "prototype-finkraft.firebaseapp.com",
  projectId: "prototype-finkraft",
  storageBucket: "prototype-finkraft.appspot.com",
  messagingSenderId: "283994867558",
  appId: "1:283994867558:web:d5038e6f45625e3c86eaa7",
  measurementId: "G-6J2FHW78VS"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const AirlineTable = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const snapshot = await firestore.collection('Workspace').get();
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
          console.log('Selected Workspace:', selectedWorkspace);

          // Fetch PANs for the selected workspace
          const panSnapshot = await firestore.collection(`Workspace/${selectedWorkspace}/PANs`).get();
          console.log('PANs snapshot:', panSnapshot.docs);

          if (panSnapshot.empty) {
            console.warn('No PANs found for the selected workspace.');
            return;
          }

          const allTableData = [];

          // Iterate through PANs
          for (const panDoc of panSnapshot.docs) {
            const pan = panDoc;
            console.log('Current PAN:', pan.id);

            // Fetch Airline_Creds for the current PAN
            const airlineCredsSnapshot = await firestore.collection(`Workspace/${selectedWorkspace}/PANs/${pan.id}/Airline_Creds`).get();
            console.log('Airline_Creds snapshot:', airlineCredsSnapshot.docs);

            // Iterate through Airline_Creds
            airlineCredsSnapshot.docs.forEach((airlineDoc) => {
              const airline = airlineDoc.data();
              console.log('Current Airline_Creds:', airline);

              // Add the airline to the overall tableData
              allTableData.push(airline);
            });
          }

          console.log('All table data:', allTableData);
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
    setEditIndex(index);
  };

  const handleSaveEdit = async (editedAirline) => {
    try {
      // Update the edited airline data in the tableData array
      const updatedTableData = [...tableData];
      updatedTableData[editIndex] = editedAirline;
      setTableData(updatedTableData);
  
      // Update the changes in the Firestore database
      const panRef = firestore.collection(`Workspace/${selectedWorkspace}/PANs`);
      const panSnapshot = await panRef.get();
  
      if (!panSnapshot.empty) {
        for (const panDoc of panSnapshot.docs) {
          const airlineCredsRef = panRef.doc(panDoc.id).collection('Airline_Creds');
          const airlineCredsSnapshot = await airlineCredsRef.where('id', '==', editedAirline.id).get();
  
          if (!airlineCredsSnapshot.empty) {
            // Assuming there's only one matching document, update it
            airlineCredsRef.doc(airlineCredsSnapshot.docs[0].id).update(editedAirline);
          }
        }
      }
  
      // Reset editIndex
      setEditIndex(null);
    } catch (error) {
      console.error('Error updating data in Firestore:', error);
    }
  };

  const handleCancelEdit = () => {
    // Reset editIndex
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    try {
      const airlineToDelete = tableData[index];
      
      // Delete the airline from the Firestore database
      const panRef = firestore.collection(`Workspace/${selectedWorkspace}/PANs`);
      const panSnapshot = await panRef.get();

      if (!panSnapshot.empty) {
        for (const panDoc of panSnapshot.docs) {
          const airlineCredsRef = panRef.doc(panDoc.id).collection('Airline_Creds');
          const airlineCredsSnapshot = await airlineCredsRef.where('id', '==', airlineToDelete.id).get();

          if (!airlineCredsSnapshot.empty) {
            // Assuming there's only one matching document, delete it
            airlineCredsRef.doc(airlineCredsSnapshot.docs[0].id).delete();
          }
        }
      }

      // Remove the airline from the tableData array
      const updatedTableData = [...tableData];
      updatedTableData.splice(index, 1);
      setTableData(updatedTableData);
    } catch (error) {
      console.error('Error deleting data from Firestore:', error);
    }
  };

  // Add state for new airline data
  const [newAirline, setNewAirline] = useState({
    airline_name: '',
    portal_id: '',
    last_ran: '',
    files_count: '',
    imap_url: '',
    portal_pass: '',
  });

  // State to manage whether the add new form is open
  const [isAddNewFormOpen, setIsAddNewFormOpen] = useState(false);

  // Function to handle input changes in the add new form
  const handleNewAirlineChange = (e) => {
    const { name, value } = e.target;
    setNewAirline((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to handle the "Add New" button click
  const handleAddNewClick = () => {
    // Open the add new form
    setIsAddNewFormOpen(true);
  };

  // Function to handle the "Save" button click in the add new form
  // Function to handle the "Save" button click in the add new form
const handleSaveNew = async () => {
  try {
    // Validate new data (you can add more validation as needed)
    if (!newAirline.airline_name || !newAirline.portal_id || !newAirline.last_ran || !newAirline.files_count || !newAirline.imap_url || !newAirline.portal_pass) {
      console.error('Please enter all required fields.');
      return;
    }

    // Create a custom ID based on some input (e.g., portal_id in this case)
    const customId = newAirline.portal_id; // You can modify this based on your specific requirement
    const fieldId = newAirline.airline_name;

    // Add the new airline to the Firestore database with the custom ID
    const panRef = firestore.collection(`Workspace/${selectedWorkspace}/PANs`).doc(customId);
    const airlineCredsRef = panRef.collection('Airline_Creds').doc(fieldId); // Firestore will still generate a unique ID for Airline_Creds
    await airlineCredsRef.set({
      id: airlineCredsRef.id, // This line includes the auto-generated ID for Airline_Creds
      ...newAirline,
    });

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



  // Function to handle the "Cancel" button click in the add new form
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
  }

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
        <EditAirline
          editingAirline={tableData[editIndex]}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
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
                <th>Pan</th>
                <th>Last Ran</th>
                <th>Files Count</th>
                <th>Imap URL</th>
                <th>Portal ID</th>
                <th>Portal Pass</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((airline, index) => (
                <tr key={index}>
                  <td>{airline['airline_name']}</td>
                  <td>{airline['portal_id']}</td>
                  <td>{airline['last_ran']}</td>
                  <td>{airline['files_count']}</td>
                  <td>{airline['imap_url']}</td>
                  <td>{airline['portal_id']}</td>
                  <td>{airline['portal_pass']}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
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
