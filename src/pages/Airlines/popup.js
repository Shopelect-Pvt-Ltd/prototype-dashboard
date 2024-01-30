// Popup.js
import React from 'react';
import '../css-importer'; // Import the CSS file for pop-up styling

const Popup = ({ children, onClose }) => {
  return (
    <div className="popup-overlay"> {/* Add an overlay to dim the background */}
      <div className="popup-box">
        <div className="popup-content">
          {children}
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </div>
  );
};

export default Popup;
