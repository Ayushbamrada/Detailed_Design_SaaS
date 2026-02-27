// import { useSelector } from "react-redux";
// import { useState } from "react";

// const DailyLogs = () => {
//   const { user } = useSelector((state) => state.auth);

//   const today = new Date().toISOString().split("T")[0];
//   const [selectedDate, setSelectedDate] = useState(today);

//   const mockLogs = [
//     {
//       id: 1,
//       project: "100 KM Highway",
//       user: "Site Engineer A",
//       date: today,
//       status: "WORKED",
//     },
//     {
//       id: 2,
//       project: "State Road Widening",
//       user: "Site Engineer B",
//       date: today,
//       status: "NOT_WORKED",
//     },
//   ];

//   const filteredLogs = mockLogs.filter(
//     (log) => log.date === selectedDate
//   );

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">
//         Daily Logs
//       </h2>

//       {/* Date Filter */}
//       <div className="flex items-center gap-4">
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="border p-2 rounded-md"
//         />
//       </div>

//       {/* USER VIEW */}
//       {user.role === "USER" && (
//         <div className="bg-white p-6 rounded-xl shadow space-y-4">
//           <h4 className="font-semibold">
//             Your Logs — {selectedDate}
//           </h4>

//           {filteredLogs
//             .filter((log) => log.user === user.name)
//             .map((log) => (
//               <div
//                 key={log.id}
//                 className="flex justify-between p-4 bg-gray-50 rounded-md"
//               >
//                 <span>{log.project}</span>
//                 <span
//                   className={
//                     log.status === "WORKED"
//                       ? "text-green-600 font-semibold"
//                       : "text-red-600 font-semibold"
//                   }
//                 >
//                   {log.status}
//                 </span>
//               </div>
//             ))}

//           <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
//             Update Today’s Log
//           </button>
//         </div>
//       )}

//       {/* ADMIN VIEW */}
//       {(user.role === "ADMIN" ||
//         user.role === "SUPER_ADMIN") && (
//         <div className="bg-white p-6 rounded-xl shadow space-y-4">
//           <h4 className="font-semibold">
//             All Logs — {selectedDate}
//           </h4>

//           {filteredLogs.map((log) => (
//             <div
//               key={log.id}
//               className="flex justify-between items-center p-4 bg-gray-50 rounded-md"
//             >
//               <div>
//                 <p className="font-semibold">
//                   {log.project}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Updated by: {log.user}
//                 </p>
//               </div>

//               <span
//                 className={
//                   log.status === "WORKED"
//                     ? "text-green-600 font-semibold"
//                     : "text-red-600 font-semibold"
//                 }
//               >
//                 {log.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DailyLogs;


import { useSelector } from "react-redux";
import { useState } from "react";
import { Calendar } from "lucide-react";

const DailyLogs = () => {
  const { user } = useSelector((state) => state.auth);
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  const mockLogs = [
    {
      id: 1,
      project: "100 KM Highway",
      user: "Site Engineer A",
      date: today,
      status: "WORKED",
      reason: "",
    },
    {
      id: 2,
      project: "State Road Widening",
      user: "Site Engineer B",
      date: today,
      status: "NOT_WORKED",
      reason: "Rain Delay",
    },
  ];

  const filteredLogs = mockLogs.filter(
    (log) => log.date === selectedDate
  );

  const workedCount = filteredLogs.filter(
    (l) => l.status === "WORKED"
  ).length;

  const notWorkedCount = filteredLogs.length - workedCount;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">
        Daily Logs Management
      </h2>

      {/* Date Selector + Stats */}
      <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Calendar size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex gap-6 text-sm">
          <span className="text-green-600 font-semibold">
            Worked: {workedCount}
          </span>
          <span className="text-red-600 font-semibold">
            Not Worked: {notWorkedCount}
          </span>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white shadow rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
          >
            <div>
              <h4 className="font-semibold">
                {log.project}
              </h4>
              <p className="text-sm text-gray-500">
                Updated by: {log.user}
              </p>
              {log.reason && (
                <p className="text-xs text-red-500 mt-1">
                  Reason: {log.reason}
                </p>
              )}
            </div>

            <span
              className={`px-4 py-1 rounded-full text-xs font-semibold ${
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

export default DailyLogs;