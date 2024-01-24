// EditAirline.js

import React, { useState } from 'react';

const EditAirline = ({ editingAirline, onSave, onCancel }) => {
  const [editedAirline, setEditedAirline] = useState({ ...editingAirline });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAirline((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedAirline);
  };

  return (
    <div className="edit-popup">
      <div className="edit-popup-content">
        <h2>Edit Airline</h2>
        <label>Airline Name:</label>
        <input type="text" name="airline_name" value={editedAirline.airline_name} onChange={handleChange} />
        {/* Add input fields for other properties as needed */}
        <label>Portal ID:</label>
        <input type="text" name="portal_id" value={editedAirline.portal_id} onChange={handleChange} />
        {/* Add input fields for other properties as needed */}
        <label>Last Ran:</label>
        <input type="text" name="last_ran" value={editedAirline.last_ran} onChange={handleChange} />
        {/* Add input fields for other properties as needed */}
        <label>Files Count:</label>
        <input type="text" name="files_count" value={editedAirline.files_count} onChange={handleChange} />
        {/* Add input fields for other properties as needed */}
        <label>Imap URL:</label>
        <input type="text" name="imap_url" value={editedAirline.imap_url} onChange={handleChange} />
        {/* Add input fields for other properties as needed */}
        <label>Portal Pass:</label>
        <input type="text" name="portal_pass" value={editedAirline.portal_pass} onChange={handleChange} />

        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditAirline;
