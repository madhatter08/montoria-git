import React from "react";

const AdminForm = ({ onClose }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Admin Form</h2>
      <form className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            placeholder="2022-1234"
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            placeholder="sample@gmail.com"
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            placeholder="09123456789"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[#9d16be] hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#9d16be] text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;