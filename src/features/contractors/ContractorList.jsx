const ContractorList = () => {
  const contractors = [
    { name: "ABC Constructions", projects: 3 },
    { name: "XYZ Infra", projects: 2 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Contractors
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {contractors.map((c, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h4 className="font-semibold">
              {c.name}
            </h4>
            <p className="text-sm text-gray-500">
              Active Projects: {c.projects}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorList;