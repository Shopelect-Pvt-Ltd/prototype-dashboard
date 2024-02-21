import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ReactSpeedometer from 'react-d3-speedometer'; // Import ReactSpeedometer

const MyGrid = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [gridOptions, setGridOptions] = useState({
        columnDefs: [],
        rowData: [],
    });

    const gridRef = useRef(null);
    const [customFilterApplied, setCustomFilter] = useState(null);
    const [scoreRange, setScoreRange] = useState({ minScore: 0, maxScore: 100 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/gstcreds');
            const rowData = [];
            let minScore = Infinity;
            let maxScore = -Infinity;

            if (typeof response.data === 'object' && response.data !== null) {
                Object.entries(response.data).forEach(([customerId, attributes]) => {
                    const rowDataItem = { Customer_id: customerId };
                    Object.entries(attributes).forEach(([key, value]) => {
                        rowDataItem[key] = value;
                    });
                    const score = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
                    rowDataItem['Score'] = score;
                    minScore = Math.min(minScore, score);
                    maxScore = Math.max(maxScore, score);
                    rowData.push(rowDataItem);
                });
                setGridOptions({ ...gridOptions, rowData });
                setScoreRange({ minScore, maxScore });
            } else {
                console.error('Invalid response format. Expected an object.', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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

    const onRowClicked = (event) => {
        const selectedData = event.data;
        setSelectedRow(selectedData);
    };

    return (
        <div className="ag-theme-alpine" style={{ width: '100vw', height: '100vh' }}>
            <h1>Meta Table</h1>
            <div className="button-group" style={{ paddingBottom: '10px' }}>
                <button onClick={() => applyCustomFilter('R1', 'R1')} title="Set R1 Filter" style={{ marginRight: '10px' }}>
                    Set R1 Filter
                </button>
                <button onClick={() => applyCustomFilter('2A', '2A')} title="Set 2A Filter" style={{ marginRight: '10px' }}>
                    Set 2A Filter
                </button>
                <button onClick={() => applyCustomFilter('2B', '2B')} title="Set 2B Filter" style={{ marginRight: '10px' }}>
                    Set 2B Filter
                </button>
                <button onClick={() => applyCustomFilter('IRN', 'IRN')} title="Set IRN Filter" style={{ marginRight: '10px' }}>
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
                    { headerName: 'IRN', field: 'IRN' },
                    { headerName: 'Score', field: 'Score' },
                ]}
                rowData={gridOptions.rowData}
                masterDetail={true}
                detailCellRenderer={(props) => <CustomScoreMeterRenderer {...props} scoreRange={scoreRange} />}  // Render score meter in detail row
                onGridReady={onGridReady}
                onRowClicked={onRowClicked}
            />
        </div>
    );
};

// Modify ScoreMeterRenderer component to use ReactSpeedometer
const CustomScoreMeterRenderer = ({ data }) => {
    const score = data.Score;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <ReactSpeedometer
                value={score}
                minValue={0}
                maxValue={100}
                startColor="red"
                endColor="green"
                needleColor="black"
                height={300} // Increase the height
                width={300} // Increase the width
            />
        </div>
    );
};

export default MyGrid;
