// EditAirline.js
import React, { useState, useEffect } from 'react';

const EditAirline = ({ editingAirline, onSave, onCancel }) => {
  const [editedAirline, setEditedAirline] = useState({ ...editingAirline });

  // Update the editedAirline state when editingAirline changes
  useEffect(() => {
    setEditedAirline({ ...editingAirline });
  }, [editingAirline]);

  const handleInputChange = (field, value) => {
    setEditedAirline((prevAirline) => ({ ...prevAirline, [field]: value }));
  };

  return (
    <div>
      <h2>Edit Airline</h2>
      <label>Name:</label>
      <input
        type="text"
        value={editedAirline.airline_name}
        onChange={(e) => handleInputChange('airline_name', e.target.value)}
      />
      <label>PAN:</label>
      <input
        type="text"
        value={editedAirline.portal_id}
        onChange={(e) => handleInputChange('portal_id', e.target.value)}
      />
      <label>Last Ran:</label>
      <input
        type="text"
        value={editedAirline.last_ran}
        onChange={(e) => handleInputChange('last_ran', e.target.value)}
      />
      <label>Files Count:</label>
      <input
        type="text"
        value={editedAirline.files_count}
        onChange={(e) => handleInputChange('files_count', e.target.value)}
      />
      <label>Imap URL:</label>
      <input
        type="text"
        value={editedAirline.imap_url}
        onChange={(e) => handleInputChange('imap_url', e.target.value)}
      />
      <label>Portal ID:</label>
      <input
        type="text"
        value={editedAirline.portal_id}
        onChange={(e) => handleInputChange('portal_id', e.target.value)}
      />
      <label>Portal Pass:</label>
      <input
        type="text"
        value={editedAirline.portal_pass}
        onChange={(e) => handleInputChange('portal_pass', e.target.value)}
      />
      <button onClick={() => onSave(editedAirline)}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditAirline;
