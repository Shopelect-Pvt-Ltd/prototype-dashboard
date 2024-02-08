import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

const LogsPage = () => {
  const [logData, setLogData] = useState({});
  const location = useLocation();

  const useQuery = () => {
    return new URLSearchParams(location.search);
  }

  const query = useQuery();

  useEffect(() => {
    const fetchLogsData = async () => {
      try {
        const db = getFirestore();
        const logsCollection = collection(db, 'cred_ls', query.get("workspace"), 'creds', query.get("workspace_id"), 'logs');
        const querySnapshot = await getDocs(logsCollection);
        
        querySnapshot.forEach((doc) => {
          if (doc.id === query.get("log_id")) {
            setLogData(doc.data());
          }
        });
      } catch (error) {
        console.error('Error fetching logs data:', error);
      }
    };

    fetchLogsData();
  }, [location.search]); // Re-fetch data when location.search changes

  const handleDownload = (url) => {
    if (url) {
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.setAttribute('download', 'downloaded_file');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const renderValue = (value) => {
    const strValue = String(value);
    // Hardcoded URLs for View and Download File buttons
    const viewUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // Update with your actual view URL
    const downloadUrl = 'https://www.clickdimensions.com/links/TestPDFfile.pdf'; // Update with your actual download URL
    
    if (strValue.startsWith('https')) {
      return (
        <div>
          <button onClick={() => window.open(viewUrl, '_blank')}>View</button>
          <button onClick={() => handleDownload(downloadUrl)}>Download File</button>
        </div>
      );
    }
    return strValue;
  };

  return (
    <div>
      <h1>This is your logs page</h1>
      <p>Logs table</p>
      <table border="1">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(logData).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{renderValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsPage;





