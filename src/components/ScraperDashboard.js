import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './scrapperdash.css';
import { useState } from 'react';

const ScraperDashboard = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [isAirlineMode, setIsAirlineMode] = useState(true);

  const tableData = [
    { id: 1, run: '1', workspace: 'Workspace A (Airline)', status: 'Success', lastRun: '2024-01-03', parsedCount: 100, errorCount: 2 },
    { id: 2, run: '2', workspace: 'Workspace B (GST)', status: 'Success', lastRun: '2024-01-03', parsedCount: 80, errorCount: 5 },
    // Add more data as needed
  ];

  useEffect(() => {
    const filteredData = tableData.filter(
      (item) =>
        (selectedWorkspace ? item.workspace.includes(selectedWorkspace) : true) &&
        (isAirlineMode ? item.workspace.includes('Airline') : item.workspace.includes('GST'))
    );

    setFilteredTableData(filteredData);
  }, [selectedWorkspace, isAirlineMode]);

  const handleRunAllClick = () => {
    console.log('RUN ALL clicked');
  };

  const handleRunClick = (rowId) => {
    console.log(`Run button clicked for row ${rowId}`);
    // Add logic to run the specific row
  };

  return (
    <div className="container">
      <label>
        Select Workspace:
        <select
          value={selectedWorkspace}
          onChange={(e) => setSelectedWorkspace(e.target.value)}
          style={{ width: '500px' }}
        >
          <option value="">Select all</option>
          <option value="Airline">Airline</option>
          <option value="GST">GST</option>
          {/* Add more options as needed */}
        </select>
      </label>

      <label>
        Date Range:
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          startDate={startDate}
          endDate={endDate}
          selectsRange
        />
        {' to '}
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          selectsEnd
        />
      </label>

      <div>
        <label>
          {isAirlineMode ? 'Airline' : 'GST'} Mode
          <label className="switch">
            <input type="checkbox" checked={isAirlineMode} onChange={() => setIsAirlineMode(!isAirlineMode)} />
            <span className="slider"></span>
          </label>
        </label>
      </div>

      <Link to="/in-progress">
        <button onClick={handleRunAllClick}>RUN ALL</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>SL.</th>
            <th>Workspace</th>
            <th>Status</th>
            <th>Last Run</th>
            <th>Scrapped Count</th>
            <th>Error Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTableData.map((item) => (
            <tr key={item.id}>
              <td>{item.run}</td>
              <td>{item.workspace}</td>
              <td>{item.status}</td>
              <td>{item.lastRun}</td>
              <td>{item.parsedCount}</td>
              <td>{item.errorCount}</td>
              <td>
                <Link to="/in-progress">
                  <button onClick={() => handleRunClick(item.id)}>RUN </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScraperDashboard;
