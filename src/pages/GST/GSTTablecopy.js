// import React, { useState, useEffect } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import axios from 'axios'; // Import Axios for HTTP requests


// // Define ActionRenderer outside GSTTableCopy component
// const ActionRenderer = ({ data, onEdit, onDelete }) => {
//   const handleEdit = () => {
//     onEdit(data);
//   };

//   const handleDelete = () => {
//     onDelete(data);
//   };

//   return (
//     <div>
//       <button onClick={handleEdit}>Edit</button>
//       <button onClick={handleDelete}>Delete</button>
//     </div>
//   );
// };

// const GSTTableCopy = () => {
//     const [rowData, setRowData] = useState([]);
//     const [gridApi, setGridApi] = useState(null);
//     const [gridColumnApi, setGridColumnApi] = useState(null);
  
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:5000/api/gstcreds');
//         setRowData(response.data);
//         console.log('Data fetched successfully:', response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
  
//     useEffect(() => {
//       fetchData();
//     }, []); // Add axios as dependency to useEffect
  
//     const columnDefs = [
//       { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
//       { headerName: 'Client', field: 'business_name' },
//       { headerName: 'GSTIN', field: 'gstin' },
//       { headerName: 'Status', field: 'status' },
//       { headerName: 'Password', field: 'password' },
//       {
//         headerName: 'Actions',
//         cellRenderer: (params) => (
//             <div>
//             <button className="ag-icon-button" onClick={() => handleEdit(params.rowIndex)} style={{ marginRight: '8px' }}>Edit</button>
//             <button className="ag-icon-button" onClick={() => handleDelete(params.rowIndex)}>Delete</button>
//           </div>
//         ),
//       },
//     ];
  
//     const onGridReady = (params) => {
//       setGridApi(params.api);
//       setGridColumnApi(params.columnApi);
//     };
  
//     const handleEdit = async (data) => {
//         try {
//             await axios.put('http://127.0.0.1:5000/api/gstcreds', data);
//             fetchData();
//         } catch (error) {
//             console.error('Error editing rows:', error);
//         }
//         };
  
//     const handleDelete = async (rowData) => {
//         // Implement delete functionality here
//         console.log('Deleting:', rowData);
//         try {
//           await axios.delete('http://127.0.0.1:5000/api/gstcreds', { data: rowData });
//           fetchData(); // Assuming fetchData is defined in the same scope
//         } catch (error) {
//           console.error('Error deleting rows:', error);
//         }
//       };
  
//     const handleAddNew = async () => {
//       const newRowData = { business_name: '', gstin: '', status: '', password: '' };
//       try {
//         await axios.post('http://127.0.0.1:5000/api/gstcreds', newRowData);
//         fetchData(); // Call fetchData after adding new data
//       } catch (error) {
//         console.error('Error adding new row:', error);
//       }
//     };
  
//     return (
//         <div className="dashboard-container" style={{ position: 'relative' }}>
//           <h1>GST CREDENTIAL TABLE</h1>
//           <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
//             <button onClick={handleAddNew} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ADD NEW</button>
//           </div>
//           <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
//             <AgGridReact
//             columnDefs={columnDefs}
//             rowData={rowData}
//             animateRows={true}
//             rowSelection="multiple"
//             onGridReady={onGridReady}
//             pagination={true}
//             paginationPageSize={10}
//             paginationPageSizeOptions={[10, 20, 50]}
//             domLayout='autoHeight'
//             context={{
//               onEdit: handleEdit,
//               onDelete: handleDelete,
//             }}
//           />
//         </div>
//       </div>
//     );
//   };
  
//   export default GSTTableCopy;






import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios'; // Import Axios for HTTP requests
import Popup from '../Airlines/popup'; // Import the Popup component

const GSTTableCopy = () => {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({
        client: '',
        gstin: '',
        status: '',
        password: ''
    });
    const [isEdit, setIsEdit] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/gstcreds');
            setRowData(response.data);
            console.log('Data fetched successfully:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Add axios as dependency to useEffect

    const columnDefs = [
        { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
        { headerName: 'Client', field: 'business_name' },
        { headerName: 'GSTIN', field: 'gstin' },
        { headerName: 'Status', field: 'status' },
        { headerName: 'Password', field: 'password' },
        {
            headerName: 'Actions',
            cellRenderer: (params) => (
                <div>
                    <button className="ag-icon-button" onClick={() => handleEdit(params.data)}>Edit</button>
                    <button className="ag-icon-button" onClick={() => handleDelete(params.data)}>Delete</button>
                </div>
            ),
        },
    ];

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    const handleEdit = (data) => {
        setIsEdit(true)
        setPopupData(data);
        setShowPopup(true);

    };

    const handleDelete = async (rowData) => {
        // Implement delete functionality here
        console.log('Deleting:', rowData);
        try {
            await axios.delete('http://127.0.0.1:5000/api/gstcreds', { data: rowData });
            fetchData(); // Assuming fetchData is defined in the same scope
        } catch (error) {
            console.error('Error deleting rows:', error);
        }
    };

    const handleAddNew = async () => {
        setPopupData({ client: '', gstin: '', status: '', password: '' });
        setShowPopup(true);
    };

    const handleSave = async () => {
        // Save or update the data in the backend
        // After saving, close the popup and refresh the data
        setShowPopup(false);
        try {
            if (isEdit)
            {
                await axios.put('http://127.0.0.1:5000/api/gstcreds', popupData);
                setIsEdit(false)
            }
            else{
                await axios.post('http://127.0.0.1:5000/api/gstcreds', popupData);
            }
            
            fetchData(); // Call fetchData after adding new data
        } catch (error) {
            console.error('Error adding new row:', error);
        }
    };

    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
          <h1>GST CREDENTIAL TABLE</h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button onClick={handleAddNew} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ADD NEW</button>
          </div>
          {showPopup && (
            <Popup>
                <div className="popup-content">
                <h2>Details</h2>
                <div className="popup-field">
                    <label>Client:</label>
                    <input type="text" value={popupData.business_name} onChange={(e) => setPopupData({ ...popupData, business_name: e.target.value })} placeholder="Client" />
                </div>
                <div className="popup-field">
                    <label>GSTIN:</label>
                    <input type="text" value={popupData.gstin} onChange={(e) => setPopupData({ ...popupData, gstin: e.target.value })} placeholder="GSTIN" />
                </div>
                <div className="popup-field">
                    <label>Status:</label>
                    <input type="text" value={popupData.status} onChange={(e) => setPopupData({ ...popupData, status: e.target.value })} placeholder="Status" />
                </div>
                <div className="popup-field">
                    <label>Password:</label>
                    <input type="text" value={popupData.password} onChange={(e) => setPopupData({ ...popupData, password: e.target.value })} placeholder="Password" />
                </div>
                <div className="popup-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
                </div>
            </Popup>
            )}
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              animateRows={true}
              rowSelection="multiple"
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeOptions={[10, 20, 50]}
              domLayout='autoHeight'
            />
          </div>
        </div>
      );
    };
    
    export default GSTTableCopy;
