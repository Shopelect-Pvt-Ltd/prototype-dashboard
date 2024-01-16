import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './AirlineTable.css';

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
        console.error('Error fetching data:', error);
      }      
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        if (selectedWorkspace) {
          // Update the path based on the selected workspace
          const path = `/Workspace/${selectedWorkspace}/PANs/AABCB3524G/Airline_Creds/klm`;
          const snapshot = await firestore.doc(path).get();
          const data = snapshot.exists ? [snapshot.data()] : [];
          setTableData(data);
        }
      } catch (error) {
        console.error('Error fetching table data: ', error);
      }
    };

    fetchTableData();
  }, [selectedWorkspace]);

  const handleDropdownChange = e => {
    setSelectedWorkspace(e.target.value);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Workspace Selector</h1>
      <label>Select Workspace: </label>
      <select onChange={handleDropdownChange} value={selectedWorkspace}>
        <option value="">Select a workspace</option>
        {workspaces.map(workspace => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>

      {selectedWorkspace && (
        <table>
          <thead>
            <tr>
              <th>Airline Name</th>
              <th>Pan</th>
              <th>Last Ran</th>
              <th>Files Count</th>
              <th>Imap URL</th>
              <th>portal_id</th>
              <th>portal_pass</th>
              {/* Add other fields as needed */}
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
                <td>{airline['portal_pass']}</td>
                <td>{airline['portal_id']}</td>
                {/* Add other fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AirlineTable;
