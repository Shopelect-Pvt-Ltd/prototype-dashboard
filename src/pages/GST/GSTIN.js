// import React from 'react';
// import { useLocation } from 'react-router-dom';

// function GSTIN() {
//     const location = useLocation();
//     const fetchedData = location.state?.fetchedData || [];

//     if (fetchedData.length === 0) {
//       return <div>No data available</div>;
//     }

//     return (
//       <div>
//         <h1>Fetched Data</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>ItemNo</th>
//               {/* Add more table headers for other properties */}
//             </tr>
//           </thead>
//           <tbody>
//             {fetchedData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item._id}</td>
//                 <td>{item.ItemNo}</td>
//                 {/* Add more table cells for other properties */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
// }

// export default GSTIN;


import React from 'react';
import { useLocation } from 'react-router-dom';

function GSTIN() {
    const location = useLocation();
    const fetchedData = location.state?.fetchedData || [];

    if (fetchedData.length === 0) {
      return <div>No data available</div>;
    }

    return (
      <div>
        <h1>Fetched Data</h1>
        <table>
          <thead>
            <tr>
              <th>GSTIN</th>
              {/* Add more table headers for other properties */}
            </tr>
          </thead>
          <tbody>
            <tr>
              {fetchedData.map((gstin, index) => (
                <tr key={index}>
                <td style={{ padding: '8px' }}>{gstin}</td>
              </tr>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
}

export default GSTIN;