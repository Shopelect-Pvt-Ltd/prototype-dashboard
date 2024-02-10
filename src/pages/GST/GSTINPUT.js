
// FetchDataPage.js
import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DataPage from '../GST/DataPage'; // Import your DataPage component

const FetchDataContext = createContext();

function FetchDataPage() {
  const [gstNumber, setGstNumber] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const [fetchedData, setFetchedData] = useState(null); // State to hold fetched data

  const handleFetchData = async () => {
    const formattedDate = formatDate(date);

    try {
      const response = await fetch(`https://apiplatform.finkraft.ai/irn/${gstNumber}/${formattedDate}`);
      const data = await response.json();
      setFetchedData(data); // Set fetched data to state
      console.log('Fetched data:', data);
      navigate('/irn-table', { state: { fetchedData: data } });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (selectedDate) => {
    const dateObj = new Date(selectedDate);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    return month + year;
  };

  return (
    <div>
      <h1>Fetch Data</h1>
      <FetchDataContext.Provider value={{ gstNumber, setGstNumber, date, setDate }}>
        <FetchDataForm />
        <button onClick={handleFetchData}>Fetch Data</button>
      </FetchDataContext.Provider>
    </div>
  );
}

function FetchDataForm() {
  const { gstNumber, setGstNumber, date, setDate } = useContext(FetchDataContext);

  return (
    <div>
      <div>
        <label>GST Number:</label>
        <input
          type="text"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
    </div>
  );
}


export default FetchDataPage;

