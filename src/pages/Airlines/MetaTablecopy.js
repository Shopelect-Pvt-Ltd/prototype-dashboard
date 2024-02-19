// import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise'; 
import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';
// import axios from 'axios';
import Popup from '../Airlines/popup';
import { useLocation } from 'react-router-dom';
import MyFilter from './MyFilter';

import React, { useState, useEffect, useRef, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

const MetaTable = (data) => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const location = useLocation();
    const selectedDomain = location.state?.selectedDomain || '';
    console.log("sdfgf", data)
    useEffect(()=>{
        setRowData(data.data)
    }, [data])


    const columnDefs = [
        { headerName: 'Credentials ID', field: 'credential_id',filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter' ,floatingFilter:true,enableRowGroup:true ,pivot: true,},
        { headerName: 'Download Month', field: 'download_month',filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true,enableRowGroup:true ,pivot: true},
        { headerName: 'Download At', field: 'stadownloaded_attus', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true,enableRowGroup:true ,pivot: true },
        { headerName: 'ID', field: 'id', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true,pivot: true  },
        { headerName: 'If Downloaded', field: 'if_downloaded', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true ,pivot: true },
        { headerName: 'Message', field: 'message', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true ,pivot: true },
        { headerName: 'Processed', field: 'processed', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true ,pivot: true},
        { headerName: 'S3 Link', field: 's3_link', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true ,pivot: true},
        { headerName: 'URL', field: 'url', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true ,pivot: true},
        { headerName: 'Script Name', field: 'script_name', filter: 'agTextColumnFilter', floatingFilterComponent: 'MyFilter',floatingFilter:true ,enableRowGroup:true,pivot: true },
        
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

    
    const onBtExport = useCallback(() => {
        gridRef.current.api.exportDataAsExcel(); 
    }, [gridRef]);

    const masterDetailParams = {
    detailGridOptions: {
        columnDefs: [
            // Additional details column definitions
        ],
        defaultColDef: { resizable: true },
    },
    getDetailRowData: function (params) {
        params.successCallback(params.data.childRecords);
    }
};

    return (
        <div className="ag-theme-alpine" style={{ position: 'relative' }}>
          <h1>Meta TABLE Data</h1>
          <button
            onClick={onBtExport}
            style={{ marginBottom: '5px', fontWeight: 'bold' }}
          >
            Export to Excel
          </button>
          
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            rowGroupPanelShow='always'
            animateRows={true}
            rowSelection="multiple"
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeOptions={[10, 20, 50]}
            domLayout='autoHeight'
            frameworkComponents={{ MyFilter: MyFilter }} 
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
                
                position: 'right',
                width: 300
            }}
            style={{ width: '100%', height: '100%' }} 
            ref={gridRef} 
        />
          </div>
        </div>
      );
    };
    
// export default MetaTable;


const MyGrid = () => {
    const [gridOptions, setGridOptions] = useState({
        columnDefs: [],
        rowData: []
    });

    const [data, setData] = useState([])

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/gstcreds');
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

    const fetchCustData = async (cust_id) => {
        console.log(cust_id)
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/gstcreds/${cust_id}`);
            const data = response.data.map(row => ({ ...row, Count: 1 }));
            setData(data);
            console.log('Filtered Data fetched successfully:', data);
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    }; 
    

    return (
        <div className="ag-theme-alpine" style={{ height: '550px', width: '100%' }}>
            <h1>Meta Table</h1>
            <AgGridReact
                columnDefs={[
                    { headerName: 'Customer ID', field: 'Customer_id',cellRenderer: 'agGroupCellRenderer',},
                    { headerName: 'R1', field: 'R1' },
                    { headerName: '2A', field: '2A' },
                    { headerName: '2B', field: '2B' },
                    { headerName: 'IRN', field: 'IRN' },
                    {
                        headerName: 'Actions', colId: 'id',
                        cellRenderer: (params) => (
                          <div>
                            <button className="ag-icon-button" onClick={() => fetchCustData(params.data.Customer_id)}>Show Data</button>
                          </div>
                        ),
                      }
                      
                      
                ]
                
            }
                
                rowData={gridOptions.rowData}
                masterDetail={true}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeOptions={[10, 20, 50]}
            />

            {data.length > 0 ? <MetaTable data={data} /> : <></>}
        </div>
    );
};

export default MyGrid;


