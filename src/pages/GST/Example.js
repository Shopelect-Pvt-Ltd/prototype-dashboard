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






//Reset headers


// import React, { useState, useEffect, useRef } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
// import Modal from 'react-modal';

// const HeaderEditor = ({ value, onChange }) => {
//   const handleInputChange = (e) => {
//     onChange(e.target.value);
//   };

//   return (
//     <input
//       type="text"
//       value={value}
//       onChange={handleInputChange}
//     />
//   );
// };

// const ExamplePage = () => {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [editedHeaders, setEditedHeaders] = useState({}); // Store edited headers
//   const gridRef = useRef(null);

//   useEffect(() => {
//     fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
//       .then(response => response.json())
//       .then(data => {
//         setRowData(data);
//         setColumnDefs(getColumnDefs());
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//   const getColumnDefs = () => {
//     return [
//       { headerName: 'Athlete', field: 'athlete', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Age', field: 'age', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Country', field: 'country', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Year', field: 'year', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Sport', field: 'sport', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Gold', field: 'gold', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Silver', field: 'silver', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Bronze', field: 'bronze', headerComponentFramework: HeaderEditor, editable: true },
//       { headerName: 'Total', field: 'total', headerComponentFramework: HeaderEditor, editable: true },
//     ];
//   };

//   const resetHeaders = () => {
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

//   useEffect(() => {
//     // Load edited headers from local storage when component mounts
//     const savedHeaders = localStorage.getItem('editedHeaders');
//     if (savedHeaders) {
//       setEditedHeaders(JSON.parse(savedHeaders));
//     } else {
//       setEditedHeaders({}); // Initialize edited headers if not present in local storage
//     }
//   }, []);
  
  
//   const onSaveChanges = () => {
//     const updatedColumnDefs = columnDefs.map(columnDef => {
//       const editedHeader = editedHeaders[columnDef.headerName];
//       if (editedHeader) {
//         return {
//           ...columnDef,
//           headerName: editedHeader
//         };
//       }
//       return columnDef;
//     });
  
//     // Update columnDefs state
//     setColumnDefs(updatedColumnDefs);
  
//     // Update ag-Grid columnDefs
//     gridRef.current.setColumnDefs(updatedColumnDefs);
  
//     // Save edited headers to local storage
//     localStorage.setItem('editedHeaders', JSON.stringify(editedHeaders));
  
//     setModalIsOpen(false);
//   };
  
//   const handleHeaderChange = (headerName, value) => {
//     setEditedHeaders(prevState => ({
//       ...prevState,
//       [headerName]: value
//     }));
//   };
  
//   const onGridReady = params => {
//     gridRef.current = params.api;
//   };

//   const containerStyle = { width: '100%', height: '100%' };
//   const gridStyle = { height: '400px', width: '100%' };

//   const defaultColDef = {
//     sortable: true,
//     filter: true,
//   };

//   return (
//     <div style={containerStyle}>
//       <div className="test-container">
//         <div className="test-header">
//           <button onClick={resetHeaders}>Reset Headers</button>
//         </div>

//         <div
//           style={gridStyle}
//           className={'ag-theme-quartz'}
//         >
//           <AgGridReact
//             rowData={rowData}
//             defaultColDef={defaultColDef}
//             columnDefs={columnDefs}
//             onGridReady={onGridReady}
//           />
//         </div>
//       </div>

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Edit Headers Modal"
//       >
//         <h2>Edit Headers</h2>
//         <div>
//           {columnDefs.map((columnDef, index) => (
//             <div key={index}>
//               <label>{columnDef.headerName}</label>
//               <HeaderEditor
//                 value={editedHeaders[columnDef.headerName] || columnDef.headerName}
//                 onChange={(value) => handleHeaderChange(columnDef.headerName, value)}
//               />
//             </div>
//           ))}
//         </div>
//         <button onClick={onSaveChanges}>Save Changes</button>
//         <button onClick={closeModal}>Close</button>
//       </Modal>
//     </div>
//   );
// };

// export default ExamplePage;


///////////////working code


// import React, { useState, useEffect, useCallback } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
// import firebase from 'firebase/compat/app'; // v9
// import 'firebase/compat/firestore'; // v9
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

// const firebaseConfig = {
//     // Your Firebase configuration
//     apiKey: "AIzaSyD33JyUFjugVISjRu_yElDamtvR0-6tBlU",
//     authDomain: "prototype-finkraft.firebaseapp.com",
//     projectId: "prototype-finkraft",
//     storageBucket: "prototype-finkraft.appspot.com",
//     messagingSenderId: "283994867558",
//     appId: "1:283994867558:web:d5038e6f45625e3c86eaa7",
//     measurementId: "G-6J2FHW78VS"
// };

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// const db = firebase.firestore();


// const ExamplePage = () => {
//   const [rowData, setRowData] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [headerNames, setHeaderNames] = useState([]);
//   const [editedHeaderNames, setEditedHeaderNames] = useState([]);


//   const getColumnDefs = useCallback(() => {
//     return [
//       {
//         headerName: 'Main Header',
//         children: headerNames.map(header => ({
//           headerName: header,
//           field: header.toLowerCase().replace(/\s+/g, '_'), // Example field names
//         })),
//       },
//     ];
//   }, [headerNames]);

//   useEffect(() => {
//     fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
//       .then(response => response.json())
//       .then(data => setRowData(data))
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//   useEffect(() => {
//     fetchHeaderNamesFromFirebase();
//   }, []);

//   const fetchHeaderNamesFromFirebase = async () => {
//     try {
//       const doc = await db.collection('Column_Header').doc('Data').get();
//       if (doc.exists) {
//         setHeaderNames(doc.data().headerNames || []);
//         setEditedHeaderNames([...doc.data().headerNames] || []);
//       } else {
//         console.log('No such document!');
//       }
//     } catch (error) {
//       console.error('Error fetching header names:', error);
//     }
//   };

//   const handleEditHeader = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleSaveHeader = async () => {
//     try {
//       await db.collection('Column_Header').doc('Data').update({ headerNames: editedHeaderNames });
//       setHeaderNames([...editedHeaderNames]);
//       setOpenDialog(false);
//     } catch (error) {
//       console.error('Error saving header names:', error);
//     }
//   };

//   const handleHeaderChange = (index, value) => {
//     const newHeaderNames = [...editedHeaderNames];
//     newHeaderNames[index] = value;
//     setEditedHeaderNames(newHeaderNames);
//   };

//   const containerStyle = { width: '100%', height: '100%' };
//   const gridStyle = { height: '400px', width: '100%' };
//   const defaultColDef = {
//     sortable: true,
//     filter: true,
//   };

//   return (
//     <div style={containerStyle}>
//       <h1 style={{ textAlign: 'center' }}>Edit Header</h1>
      
//       <Button variant="outlined" color="primary" onClick={handleEditHeader}>
//         Edit Header
//       </Button>
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Edit Header Names</DialogTitle>
//         <DialogContent>
//           {headerNames.map((header, index) => (
//             <TextField
//               key={index}
//               margin="normal"
//               label={`Header ${index + 1}`}
//               value={editedHeaderNames[index]}
//               onChange={event => handleHeaderChange(index, event.target.value)}
//               fullWidth
//             />
//           ))}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveHeader} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <div style={gridStyle} className={'ag-theme-quartz'}>
//         <AgGridReact
//           rowData={rowData}
//           defaultColDef={defaultColDef}
//           columnDefs={getColumnDefs()}
//         />
//       </div>
//     </div>
//   );
// };

// export default ExamplePage;

