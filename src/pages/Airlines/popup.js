// Popup.js
import React from 'react';

const Popup = ({ children, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
