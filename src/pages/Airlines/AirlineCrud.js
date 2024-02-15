
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise'; // Import Ag-Grid Enterprise features
import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';
import axios from 'axios';
import Popup from '../Airlines/popup';
import { useLocation } from 'react-router-dom';
import MyFilter from '../Airlines/MyFilter';

const AirlineCrud = () => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef(null); // Initialize gridRef with null
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [popupData, setPopupData] = useState({
        ID : '',
        Client: '',
        Workspace: '',
        Portal_ID: '',
        Portal_Pass: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    const location = useLocation();
    const selectedDomain = location.state?.selectedDomain || '';

    useEffect(() => {
        fetchData();
    }, []); // Add selectedDomain as dependency to useEffect

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/airlinecreds');
            console.log(response);
            const data = response.data; // Get all data without filtering
            setRowData(data);
            console.log('All Data fetched successfully:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }; // Add axios as dependency to useEffect

    const columnDefs = [
        { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
        { headerName: 'ID', field: 'id', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter', floatingFilter: true ,enableRowGroup:true },
        { headerName: 'Client', field: 'airline_name', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter', floatingFilter: true ,enableRowGroup:true },
        { headerName: 'Workspace', field: 'workspace', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter', floatingFilter: true ,enableRowGroup:true  },
        { headerName: 'Portal ID', field: 'portal_id', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter', floatingFilter: true ,enableRowGroup:true },
        // { headerName: 'Password', field: 'password', filter: true },
        {
            headerName: 'Portal Pass',
            field: 'portal_pass',
            filter: true,
            cellRenderer: (params) => (
                <span>{'*'.repeat(params.value.length)}</span>
            ),
        },
        {
            headerName: 'Actions',
            cellRenderer: (params) => (
                <div>
                    <button className="ag-icon-button edit-button" onClick={() => handleEdit(params.data)}>Edit</button>
                    <button className="ag-icon-button delete-button" onClick={() => handleDelete(params.data)}>Delete</button>
                </div>
            ),
        },
    ];

    const defaultColDef = useMemo(() => {
        return {
            editable: true,
            filter: true,
        };
    }, []);

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
            await axios.delete('http://127.0.0.1:5000/api/airlinecreds', { data: rowData });
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
            if (isEdit) {
                await axios.put('http://127.0.0.1:5000/api/airlinecreds', popupData);
                setIsEdit(false)
            }
            else {
                await axios.post('http://127.0.0.1:5000/api/airlinecreds', popupData);
            }

            fetchData(); // Call fetchData after adding new data
        } catch (error) {
            console.error('Error adding new row:', error);
        }
    };

    const onBtExport = useCallback(() => {
        gridRef.current.api.exportDataAsExcel(); // Access grid API from the ref
    }, [gridRef]);

    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
            <h1>Airline CREDENTIAL TABLE</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px',marginRight: '5px' }}>
                <button onClick={handleAddNew} style={{ padding: '8px 16px', backgroundColor: '#0056b3', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ADD NEW</button>
            </div>
            <button
                onClick={onBtExport}
                style={{ marginBottom: '5px', fontWeight: 'bold',marginLeft: '5px', }}
            >
                Export to Excel
            </button>
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
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowGroupPanelShow='always'
                    rowData={rowData}
                    animateRows={true}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeOptions={[10, 20, 50]}
                    domLayout='autoHeight'
                    frameworkComponents={{ MyFilter: MyFilter }} // Correct the name here
                    sideBar={{
                        toolPanels: [
                            {
                                id: 'filters',
                                labelDefault: 'Filters',
                                labelKey: 'filters',
                                iconKey: 'filter',
                                toolPanel: 'agFiltersToolPanel',
                                toolPanelParams: {
                                    suppressFilterSearch: true,
                                    debounceMs: 200
                                }
                            },
                            {
                                id: 'columns',
                                labelDefault: 'Columns',
                                labelKey: 'columns',
                                iconKey: 'columns',
                                toolPanel: 'agColumnsToolPanel',
                                minWidth: 225,
                                maxWidth: 225,
                                width: 225
                            },
                        ],
                        defaultToolPanel: 'filters',
                        position: 'right', // Specify the position of the side column toolbar
                        width: 300 // Specify the width of the side column toolbar
                    }}
                    style={{ width: '100%', height: '100%' }} // Adjusted styles
                    ref={gridRef} // Attach the grid reference to the ref
                />
            </div>
        </div>
    );
};

export default AirlineCrud;
