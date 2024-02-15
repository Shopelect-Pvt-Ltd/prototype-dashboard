import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import firebase from 'firebase/compat/app'; // v9
import 'firebase/compat/firestore'; // v9
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

const firebaseConfig = {
    // Your Firebase configuration
    apiKey: "AIzaSyD33JyUFjugVISjRu_yElDamtvR0-6tBlU",
    authDomain: "prototype-finkraft.firebaseapp.com",
    projectId: "prototype-finkraft",
    storageBucket: "prototype-finkraft.appspot.com",
    messagingSenderId: "283994867558",
    appId: "1:283994867558:web:d5038e6f45625e3c86eaa7",
    measurementId: "G-6J2FHW78VS"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const ExamplePage = () => {
  const [rowData, setRowData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [apiHeaderNames, setApiHeaderNames] = useState([]);
  const [displayHeaderNames, setDisplayHeaderNames] = useState([]);
  const [editedHeaderNames, setEditedHeaderNames] = useState([]);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then(response => response.json())
      .then(data => {
        setRowData(data);
        setApiHeaderNames(Object.keys(data[0])); // Set API header names for data mapping
        console.log('API Header Names:', Object.keys(data[0]));
        setDisplayHeaderNames(Object.keys(data[0])); // Set API header names for displaying in frontend
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchHeaderNamesFromFirebase();
  }, []);

  const fetchHeaderNamesFromFirebase = async () => {
    try {
      const doc = await db.collection('Column_Header').doc('Data').get();
      if (doc.exists) {
        const fetchedHeaderNames = doc.data().headerNames || [];
        console.log('Firebase Header Names for Frontend:', fetchedHeaderNames);
        setDisplayHeaderNames([...fetchedHeaderNames]); // Set header names for display in frontend
        setEditedHeaderNames([...fetchedHeaderNames]);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching header names:', error);
    }
  };

  const handleEditHeader = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveHeader = async () => {
    try {
      await db.collection('Column_Header').doc('Data').update({ headerNames: editedHeaderNames });
      setDisplayHeaderNames([...editedHeaderNames]); // Update header names for display in frontend
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving header names:', error);
    }
  };

  const handleHeaderChange = (index, value) => {
    const newHeaderNames = [...editedHeaderNames];
    newHeaderNames[index] = value;
    setEditedHeaderNames(newHeaderNames);
  };

  const containerStyle = { width: '100%', height: '100%' };
  const gridStyle = { height: '400px', width: '100%' };
  const defaultColDef = {
    sortable: true,
    filter: true,
  };

  const getColumnDefs = useCallback(() => {
    return [
      {
        headerName: 'Main Header',
        children: displayHeaderNames.map((header, index) => ({
          headerName: header, // Display the modified header name
          field: apiHeaderNames[index].toLowerCase().replace(/\s+/g, '_'), // Original field name for data mapping
        })),
      },
    ];
  }, [apiHeaderNames, displayHeaderNames]);

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center' }}>Edit Header</h1>
      <Button variant="outlined" color="primary" onClick={handleEditHeader}>
        Edit Header
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Header Names</DialogTitle>
        <DialogContent>
          {displayHeaderNames.map((header, index) => (
            <TextField
              key={index}
              margin="normal"
              label={`Header ${index + 1}`}
              value={editedHeaderNames[index]}
              onChange={event => handleHeaderChange(index, event.target.value)}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveHeader} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <div style={gridStyle} className={'ag-theme-quartz'}>
        <AgGridReact
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={getColumnDefs()}
        />
      </div>
    </div>
  );
};

export default ExamplePage;