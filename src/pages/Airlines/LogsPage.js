import React, { useEffect, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { getFirestore, collection, getDocs, queryEqual } from 'firebase/firestore';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation
} from 'react-router-dom'
import { format } from 'date-fns';

const LogsPage = () => {
  const [logData, setLogData] =  useState({});
  const useQuery= () => {
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
        // console.log(querySnapshot.docs.doc(query.get("log_id")))
        // Array to store logs
        const logs = [];

        // Iterate through the query snapshot
        querySnapshot.forEach(async (doc) => {
          // Get the document ID
          if(doc.id === query.get("log_id"))
          {
            setLogData(doc.data())
            console.log(doc.data())
            return
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
                <td>{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsPage;

