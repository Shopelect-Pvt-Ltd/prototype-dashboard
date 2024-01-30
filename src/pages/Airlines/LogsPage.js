import React, { useEffect, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { getFirestore, collection, getDocs, queryEqual } from 'firebase/firestore';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { format } from 'date-fns';

const LogsPage = () => {
  const [logData, setLogData] = useState({});
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  useEffect(() => {
    // Function to fetch logs data
    const fetchLogsData = async () => {
      try {
        // Get Firestore instance
        const db = getFirestore();
        // Define the path to the logs collection (replace with your actual path)
        const logsCollection = collection(db, 'cred_ls', query.get("workspace"), 'creds', query.get("workspace_id"), 'logs');

        // Get the query snapshot of logs collection
        const querySnapshot = await getDocs(logsCollection);

        // Iterate through the query snapshot
        querySnapshot.forEach(async (doc) => {
          // Get the document ID
          if (doc.id === query.get("log_id")) {
            setLogData(doc.data());
            console.log(doc.data());
            return;
          }
        });

      } catch (error) {
        // Handle errors during data fetching
        console.error('Error fetching logs data:', error);
      }
    };

    fetchLogsData();
    // Invoke the fetchLogsData function

  }, []);

  const renderValue = (value) => {
    // Convert value to string
    const strValue = String(value);
    // Check if value is a URL
    if (strValue.startsWith('https')) {
      const url = 'https://storage.googleapis.com/prototype-finkraft.appspot.com/lufthansa/2203543092461_1013.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-36587%40prototype-finkraft.iam.gserviceaccount.com%2F20240130%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240130T115542Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=b563ffe8099a6f5d67a0e8b79372d8e9fc30ada66dac31904ded7929e6409bde2e9741cb52d0e9f4f04e604668dcfb070b2b89d0d5848e0524b24426f28ae3e049554b949577810f988e16e49eae2e36d775cec6ed0d8cab2379d54f44510c1801870a6eacff6c4a6e3a2cf8947dbec980ee60b5633ff4c70549a8f3468c555824731b3f202940626a165f823869f1dcec4eb0b930209fe0dbe261ece6c88132c5d9c0dac90f71dd368eb9b7d591a20a216dd92efab4a67ba83324cb0bbe063c9bc18f886a6ec23297f7a30a7a5d75bcbac5330760a54b335d4ba7a52fa4c13a9622e690b3b62989b0028e25508eac90392bfc8bf243fade258c70c69a27bc49';

      return (
        <div>
          <button onClick={() => window.open(url, '_blank')}>View</button>
          <button onClick={() => window.location.href = url}>Download</button>
        </div>
      );
    }
    return strValue;
  };

  return (
    <div>
      <h1>This is your logs page</h1>
      Logs table
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
