
// Import necessary dependencies from React and Firebase
import React, { useEffect, useState } from 'react';
import { useNavigate,createSearchParams } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useParams} from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation
} from 'react-router-dom'
import { format } from 'date-fns';

// Define the LogsListPage component
const LogsListPage = (props) => {
  // State to hold the logs data
  const [logsData, setLogsData] = useState([]);
  const [workspace, setWorkspace] = useState("")
  const [workspaceId, setWorkspaceId] = useState("")
  // React Router's navigation hook
  const navigate = useNavigate();

  const useQuery= () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  // useEffect hook to fetch logs data on component mount

  useEffect(() => {
    // Function to fetch logs data
    const fetchLogsData = async () => {
      try {
        // Get Firestore instance
        const db = getFirestore();
        // Define the path to the logs collection (replace with your actual path)
        const logsCollection = collection(db, 'cred_ls', query.get("workspace"), 'creds', query.get("workspace_id"), 'logs');
        // console.log("logs data",logsCollection)
        // Get the query snapshot of logs collection
        const querySnapshot = await getDocs(logsCollection);

        // Array to store logs
        const logs = [];

        // Iterate through the query snapshot
        querySnapshot.forEach(async (doc) => {
          // Get the document ID
          const docId = doc.id;

          // Function to convert timestamp to date
          function toDateTime(secs) {
            var t = new Date(1970, 0, 1); // Epoch
            t.setSeconds(secs);
            return t;
          }

          // Get the created timestamp and convert it to a human-readable date
          var created = toDateTime(doc._document.createTime.timestamp.seconds);

          // Log the created date for debugging
          console.log("CREATED AT", created.toString());

          // Push the log object to the logs array
          logs.push({
            id: doc.id,
            createdAt: created.toString(),
          });
        });

        // Set the logs data in the state
        setLogsData(logs);
      } catch (error) {
        // Handle errors during data fetching
        console.error('Error fetching logs data:', error);
      }
    };
    
    fetchLogsData();
    // Invoke the fetchLogsData function

  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  // Function to handle click on "View Detail" button
  const onViewDetailClick = (logId) => {
    // Navigate to the logs detail page
    navigate({
      pathname: `/logs`,
      search: `?${createSearchParams({
        workspace: `${query.get("workspace")}`,
        workspace_id: `${query.get("workspace_id")}`,
          log_id: `${logId}`
      })}`
  });
    // navigate(`/logs`);
  };

  // Render the LogsListPage component
  return (
    <div>
      <h1>Logs List</h1>
      {/* Logs table */}
      <table border="1">
        <thead>
          <tr>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {logsData.map((log) => (
            <tr key={log.id}>
              <td>{format(new Date(log.createdAt), 'MMMM do yyyy, h:mm:ss a')}</td>
              <td>
                <button onClick={() => onViewDetailClick(log.id)}>View Detail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export the LogsListPage component
export default LogsListPage;
