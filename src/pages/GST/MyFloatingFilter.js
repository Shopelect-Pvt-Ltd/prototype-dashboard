// import React, { useState } from 'react';

// const MyFloatingFilter = (props) => {
//   const [filterText, setFilterText] = useState('');

//   const onChange = (e) => {
//     const newText = e.target.value;
//     setFilterText(newText);
//     props.onFloatingFilterChanged({ newValue: newText });
//   };

//   return (
//     <div style={{ padding: '5px' }}>
//       <input
//         type="hello world"
//         value={filterText}
//         onChange={onChange}
//         placeholder={`Filter ${props.column.colId}`}
//         style={{ width: '150px' }}
//       />
//     </div>
//   );
// };

// export default MyFloatingFilter;