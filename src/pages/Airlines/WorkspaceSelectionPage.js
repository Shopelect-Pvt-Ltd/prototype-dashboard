import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import '../css-importer';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import AirlineTable from './AirlineTable'; // Import AirlineTable component
import firebaseConfig from '../config/firebase';

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const WorkspaceSelectionPage = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate instead of useHistory

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

  const handleDropdownChange = (e) => {
    const { value } = e.target;
    setSelectedWorkspace(value);
    // Route to "/Airtable" when a workspace is selected
    navigate('/AirlineTable'); // Use navigate instead of history.push
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

      {selectedWorkspace && <AirlineTable selectedWorkspace={selectedWorkspace} />}
    </div>
  );
};

export default WorkspaceSelectionPage;
