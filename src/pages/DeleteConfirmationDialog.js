import React from 'react';

const DeleteConfirmationDialog = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-dialog">
      <div className="dialog-content">
        <p>Are you sure you want to delete it?</p>
        <div className="buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
