import { useState } from "react";

const ExtensionModal = ({ onClose }) => {
  const [reason, setReason] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleSubmit = () => {
    console.log("Extension Requested:", { reason, newDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h3 className="font-semibold text-lg">
          Request Deadline Extension
        </h3>

        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        <textarea
          placeholder="Reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionModal;