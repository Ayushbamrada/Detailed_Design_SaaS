import { useParams } from "react-router-dom";
import { useState } from "react";

const ProjectLogs = () => {
  const { id } = useParams();

  const [logs, setLogs] = useState([
    {
      date: "2026-02-20",
      status: "WORKED",
      note: "Foundation completed",
    },
    {
      date: "2026-02-21",
      status: "NOT_WORKED",
      note: "Rain delay",
    },
  ]);

  const [status, setStatus] = useState("WORKED");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const newLog = {
      date: new Date().toISOString().split("T")[0],
      status,
      note,
    };

    setLogs([newLog, ...logs]);
    setNote("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Daily Logs — Project {id}
      </h2>

      {/* Add Log Form */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h4 className="font-semibold">Add Daily Log</h4>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="WORKED">Worked</option>
          <option value="NOT_WORKED">Not Worked</option>
        </select>

        {status === "NOT_WORKED" && (
          <textarea
            placeholder="Reason..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-xl p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">{log.date}</p>
              <p className="text-sm text-gray-600">
                {log.note || "Worked normally"}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                log.status === "WORKED"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectLogs;