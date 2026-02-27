import { useState } from "react";

const DailyLogForm = () => {
  const [status, setStatus] = useState("WORKED");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    console.log("Daily Log:", { status, reason });
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-4">
      <h4 className="font-semibold">Daily Work Log</h4>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border p-2 rounded-md"
      >
        <option value="WORKED">Worked</option>
        <option value="NOT_WORKED">Not Worked</option>
      </select>

      {status === "NOT_WORKED" && (
        <textarea
          placeholder="Reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Submit Log
      </button>
    </div>
  );
};

export default DailyLogForm;