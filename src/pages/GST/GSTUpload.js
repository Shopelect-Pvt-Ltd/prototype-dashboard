import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import Popup from '../Airlines/popup'; // Import the Popup component

import MyFilter from './MyFilter';

const GSTUpload = () => {
    const [rowData, setRowData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({
        client: '',
        gstin: '',
        status: '',
        password: ''
    });

    // Function to handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            complete: (result) => {
                // Set the parsed CSV data to rowData state
                setRowData(result.data);
            }
        });
    };

    // Define column definitions for the grid table
    const columnDefs = useMemo(() => [
        { headerName: 'Client', field: '1' }, // Assuming the first column in CSV represents 'Client'
        { headerName: 'GSTIN', field: '2' }, // Assuming the second column in CSV represents 'GSTIN'
        { headerName: 'Status', field: '3' }, // Assuming the third column in CSV represents 'Status'
        { headerName: 'Password', field: '4' }, // Assuming the fourth column in CSV represents 'Password'
    ], []);

    // Function to handle save action
    const handleSave = () => {
        // Implement save functionality here
        setShowPopup(false);
    };

    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
            <h1>GST UPLOAD TABLE</h1>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {/* Input field for uploading CSV file */}
                <label>Upload Your CSV Here </label>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button onClick={() => setShowPopup(true)}>ADD NEW</button>
            </div>
            {/* Popup for adding new data */}
            {showPopup && (
                <Popup>
                    <div className="popup-content">
                        <h2>Details</h2>
                        <div className="popup-field">
                            <label>Client:</label>
                            <input type="text" value={popupData.client} onChange={(e) => setPopupData({ ...popupData, client: e.target.value })} placeholder="Client" />
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
            <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    domLayout='autoHeight'
                />
            </div>
        </div>
    );
};

export default GSTUpload;
