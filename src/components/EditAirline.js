// EditAirline.js
import React, { useState } from 'react';

const EditAirline = ({ editingAirline, onSave, onCancel }) => {
  const [editedAirline, setEditedAirline] = useState({ ...editingAirline });

  const handleInputChange = (field, value) => {
    setEditedAirline((prevAirline) => ({ ...prevAirline, [field]: value }));
  };

  return (
    <div>
      <h2>Edit Airline</h2>
      <label>Name:</label>
      <input
        type="text"
        value={editedAirline.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
      />
      <label>PAN:</label>
      <input
        type="text"
        value={editedAirline.pan}
        onChange={(e) => handleInputChange('pan', e.target.value)}
      />
      <label>UserID:</label>
      <input
        type="text"
        value={editedAirline.userId}
        onChange={(e) => handleInputChange('userId', e.target.value)}
      />
      <label>Password:</label>
      <input
        type="text"
        value={editedAirline.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
      />
      <button onClick={() => onSave(editedAirline)}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditAirline;
