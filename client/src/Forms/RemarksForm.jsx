import React, { useState } from "react";

const Remarksform = ({ onSave, onCancel }) => {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSave) {
      onSave(remarks);
    }
  };

  return (
    <div className="w-[924px] h-[495px] bg-white rounded-[15px] p-6 shadow-lg relative">
      <h2 className="text-black text-4xl font-bold font-['League Spartan'] mb-4">REMARKS</h2>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <label className="text-xl font-thin text-[#1e1e1e] mb-2">Write your remarks</label>
        <textarea
          className="w-full h-[297px] bg-[#d9d9d9] rounded-[15px] p-4 text-black text-lg"
          placeholder="Enter your remarks here..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="text-[#9d16be] text-2xl font-medium py-3 px-6"
            onClick={onCancel}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-[#4A154B] text-white text-2xl font-medium py-3 px-6 rounded-[15px]"
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default Remarksform;
