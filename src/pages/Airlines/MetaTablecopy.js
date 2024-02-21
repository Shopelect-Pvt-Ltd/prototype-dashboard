
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MyGrid = () => {
    const [gridOptions, setGridOptions] = useState({
        columnDefs: [],
        rowData: [],
    });

    const gridRef = useRef(null);
    const [customFilterApplied, setCustomFilter] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/gstcreds');
            console.log("fetched data",response.data)
            const rowData = [];
            if (typeof response.data === 'object' && response.data !== null) {
                Object.entries(response.data).forEach(([customerId, attributes]) => {
                    const rowDataItem = { Customer_id: customerId };
                    Object.entries(attributes).forEach(([key, value]) => {
                        rowDataItem[key] = value;
                    });
                    rowData.push(rowDataItem);
                });
                setGridOptions({ ...gridOptions, rowData });
            } else {
                console.error('Invalid response format. Expected an object.', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchCustData = async (params) => {
        try {
            let response;
            if (customFilterApplied) {
                response = await axios.get(`http://127.0.0.1:5000/api/gstcreds/${params.data.Customer_id}`);
                console.log("filter data",response.data)
                let filteredData = [];
                if (customFilterApplied.field === 'R1') {
                    filteredData = response.data.filter(row => row.script_name === 'R1');
                } else if (customFilterApplied.field === '2A') {
                    filteredData = response.data.filter(row => row.script_name === '2A');
                } else if (customFilterApplied.field === '2B') {
                    filteredData = response.data.filter(row => row.script_name === '2B');
                } else if (customFilterApplied.field === 'IRN') {
                    filteredData = response.data.filter(row => row.script_name === 'IRN');
                }
                const detailData = filteredData.map(row => ({ ...row, Count: 1 }));
                params.successCallback(detailData);
                console.log('Filtered Data fetched successfully:', detailData);
            } else {
                response = await axios.get(`http://127.0.0.1:5000/api/gstcreds/${params.data.Customer_id}`);
                const detailData = response.data.map(row => ({ ...row, Count: 1 }));
                params.successCallback(detailData);
                console.log('Data fetched successfully:', detailData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    const detailColumnDefs = [
        { headerName: 'Credentials ID', field: 'credential_id' },
        { headerName: 'Business Name', field: 'business_name' },
        { headerName: 'GSTIN', field: 'gstin' },
        { headerName: 'Download Month', field: 'download_month' },
        { headerName: 'Download At', field: 'stadownloaded_attus' },
        { headerName: 'ID', field: 'id' },
        { headerName: 'If Downloaded', field: 'if_downloaded' },
        { headerName: 'Message', field: 'message' },
        { headerName: 'Processed', field: 'processed' },
        { headerName: 'S3 Link', field: 's3_link' },
        { headerName: 'URL', field: 'url' },
        { headerName: 'Script Name', field: 'script_name' },
    ];


    const detailCellRendererParams = {
        detailGridOptions: {
            columnDefs: detailColumnDefs,
            defaultColDef: {
                resizable: true,
            },
        },
        getDetailRowData: (params) => {
            fetchCustData(params);
        },
    };

    const applyCustomFilter = (field, value) => {
        setCustomFilter({ field, value });
        if (gridRef.current) {
            gridRef.current.onFilterChanged();
        }
    };

    const resetFilter = () => {
        setCustomFilter(null);
        if (gridRef.current) {
            gridRef.current.onFilterChanged();
        }
    };

    const onGridReady = (params) => {
        gridRef.current = params.api;
    };

    return (
        <div className="ag-theme-alpine" style={{ width: '100vw', height: '100vh', }}>
            <h1>Meta Table</h1>
            <div className="button-group"   style={{ paddingBottom: '10px' }} >
                <button onClick={() => applyCustomFilter('R1', 'R1')} title="Set R1 Filter"  style={{ marginRight: '10px' }}>
                    Set R1 Filter
                </button>
                <button onClick={() => applyCustomFilter('2A', '2A')} title="Set 2A Filter" style={{ marginRight: '10px' }}>
                    Set 2A Filter
                </button>
                <button onClick={() => applyCustomFilter('2B', '2B')} title="Set 2B Filter"  style={{ marginRight: '10px' }}>
                    Set 2B Filter
                </button>
                <button onClick={() => applyCustomFilter('IRN', 'IRN')} title="Set IRN Filter"  style={{ marginRight: '10px' ,}}>
                    Set IRN Filter
                </button>
                <button onClick={resetFilter} title="Reset Filter">
                    Reset Filter
                </button>
            </div>
            <AgGridReact
                columnDefs={[
                    { headerName: 'Customer ID', field: 'Customer_id', cellRenderer: 'agGroupCellRenderer' },
                    { headerName: 'R1', field: 'R1' },
                    { headerName: '2A', field: '2A' },
                    { headerName: '2B', field: '2B' },
                    { headerName: 'IRN', field: 'IRN' }
                ]}
                rowData={gridOptions.rowData}
                masterDetail={true}
                detailCellRendererParams={detailCellRendererParams}
                pagination={true}
                paginationPageSize={20}
                paginationPageSizeOptions={[10, 20, 50]}
                onGridReady={onGridReady}
            />
        </div>
    );
};

export default MyGrid;








