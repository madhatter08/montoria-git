//import { useState } from "react";
import PropTypes from "prop-types";


const SaveModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-90 bg-[rgba(0,0,0,0.3)] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#4A154B] text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
SaveModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default SaveModal;
