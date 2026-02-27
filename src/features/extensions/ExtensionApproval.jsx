const ExtensionApproval = () => {
  const requests = [
    {
      project: "State Road Widening",
      requestedDate: "2026-03-15",
      reason: "Rain Delay",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Extension Requests
      </h2>

      {requests.map((req, i) => (
        <div
          key={i}
          className="bg-white shadow rounded-xl p-6 flex justify-between"
        >
          <div>
            <h4 className="font-semibold">
              {req.project}
            </h4>
            <p className="text-sm text-gray-500">
              Requested Date: {req.requestedDate}
            </p>
            <p className="text-xs text-red-500">
              Reason: {req.reason}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Approve
            </button>
            <button className="bg-red-600 text-white px-3 py-1 rounded">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExtensionApproval;