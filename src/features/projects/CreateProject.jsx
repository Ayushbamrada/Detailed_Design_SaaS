// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Plus } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { addProject } from "./projectSlice";
// import { useNavigate } from "react-router-dom";

// const MASTER_ACTIVITIES = [
//   {
//     name: "Field Team Mobilization Advance",
//     subActivities: [
//       { name: "Mobilization", unit: "Complete" }
//     ]
//   },
//   {
//     name: "Field Activities",
//     subActivities: [
//       { name: "Topo Survey", unit: "Km" },
//       { name: "Traffic Survey and Soil Sampling", unit: "Nos." },
//       { name: "Geotech Investigations", unit: "Nos." },
//       { name: "FWD", unit: "Km" }
//     ]
//   },
//   {
//     name: "Design Scope",
//     subActivities: [
//       { name: "TCS", unit: "Nos." },
//       { name: "MCW", unit: "Km" },
//       { name: "Cross Road", unit: "Nos." },
//       { name: "Service Road", unit: "Km" },
//       { name: "Slip Road", unit: "Km" },
//       { name: "Interchange", unit: "Km" },
//       { name: "PDR", unit: "Complete" },
//       { name: "DBR", unit: "Complete" },
//       { name: "Drain", unit: "Km" },
//       { name: "Miscellaneous Highway", unit: "Percentage" },
//       { name: "Signage", unit: "Km" },
//       { name: "Junction Box", unit: "Nos." },
//       { name: "Box Culverts", unit: "Nos." },
//       { name: "Pipe Culverts", unit: "Nos." },
//       { name: "FO", unit: "Nos." },
//       { name: "MNB", unit: "Nos." },
//       { name: "MJB", unit: "Nos." },
//       { name: "ROB", unit: "Nos." },
//       { name: "FOB", unit: "Nos." },
//       { name: "VUP", unit: "Nos." },
//       { name: "VOP", unit: "Nos." },
//       { name: "SVUP", unit: "Nos." },
//       { name: "LVUP", unit: "Nos." },
//       { name: "RUB", unit: "Nos." },
//       { name: "PUP", unit: "Nos." },
//       { name: "Tunnel Design", unit: "Complete" },
//       { name: "Cut and Cover Design", unit: "Complete" },
//       { name: "Slope Protection", unit: "Km" },
//       { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "Complete" },
//       { name: "Miscellaneous Structure", unit: "Percentage" },
//       { name: "Approval from Proof and Safety", unit: "Percentage" },
//       { name: "Approval from Authority", unit: "Percentage" }
//     ]
//   }
// ];

// const companies = [
//   { name: "CivilMantra ConsAi Ltd", logo: "/civilmantra.png" },
//   { name: "Saptagon Asia Pvt Ltd", logo: "/saptagon.png" }
// ];

// const CreateProject = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     code: "",
//     name: "",
//     shortName: "",
//     company: "",
//     subCompany: "",
//     location: "",
//     sector: "",
//     department: "",
//     totalLength: "",
//     cost: "",
//     loaDate: "",
//     completionDate: "",
//     activities: []
//   });

//   const [sectors, setSectors] = useState(["Highway", "Bridge", "Metro"]);
//   const [departments, setDepartments] = useState(["Execution", "Planning"]);
//   const [newSector, setNewSector] = useState("");
//   const [newDepartment, setNewDepartment] = useState("");

//   const [selectedActivity, setSelectedActivity] = useState("");
//   const [expandedActivity, setExpandedActivity] = useState(null);
//   const [subActivityModal, setSubActivityModal] = useState(null);
//   const [subActivityInput, setSubActivityInput] = useState("");
//   const [subActivitiesMap, setSubActivitiesMap] = useState({});

//   const [selectedActivities, setSelectedActivities] = useState([]);

//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     if (!form.code || !form.name || !form.shortName) {
//       alert("Please fill mandatory fields");
//       return false;
//     }
//     if (!form.company) {
//       alert("Select Company");
//       return false;
//     }
//     if (form.totalLength <= 0) {
//       alert("Invalid Total Length");
//       return false;
//     }
//     return true;
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = () => {
//     if (!validate()) return;

//     const formattedActivities = form.activities.map((act) => ({
//       id: act + Date.now(),
//       name: act,
//       completed: false,
//       subActivities: (subActivitiesMap[act] || []).map((sub) => ({
//         id: sub + Date.now(),
//         name: sub,
//         completed: false
//       }))
//     }));

//     dispatch(addProject({ ...form, activities: formattedActivities }));
//     navigate("/projects");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-6xl mx-auto space-y-8"
//     >
//       <h2 className="text-3xl font-bold text-gray-800">
//         Create New Project
//       </h2>

//       {/* ================= FORM SECTION ================= */}
//       <div className="bg-white rounded-3xl shadow-xl p-10 grid md:grid-cols-2 gap-6 border">

//         {/* Modern Input Style */}
//         {[
//           { label: "Project Code *", key: "code" },
//           { label: "Project Name *", key: "name" },
//           { label: "Short Name *", key: "shortName" },
//           { label: "Location", key: "location" }
//         ].map((field) => (
//           <input
//             key={field.key}
//             placeholder={field.label}
//             value={form[field.key]}
//             onChange={(e) => handleChange(field.key, e.target.value)}
//             className="modern-input"
//           />
//         ))}

//         {/* Company with Logo */}
//         <div>
//           <select
//             className="modern-input"
//             onChange={(e) => handleChange("company", e.target.value)}
//           >
//             <option value="">Select Company</option>
//             {companies.map((c) => (
//               <option key={c.name} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>

//           {form.company && (
//             <img
//               src={
//                 form.company.includes("CivilMantra")
//                   ? "/civilmantra.png"
//                   : "/saptagon.png"
//               }
//               alt="logo"
//               className="h-12 mt-3 rounded"
//             />
//           )}
//         </div>

//         {/*Sub Company Dropdown*/}
//         <div>
//           <select
//             className="modern-input"
//             onChange={(e) => handleChange("company", e.target.value)}
//           >
//             <option value="">Select Company</option>
//             {companies.map((c) => (
//               <option key={c.name} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>

//           {form.company && (
//             <img
//               src={
//                 form.company.includes("CivilMantra")
//                   ? "/civilmantra.png"
//                   : "/saptagon.png"
//               }
//               alt="logo"
//               className="h-12 mt-3 rounded"
//             />
//           )}
//         </div>

//         {/* Sector with Add Button */}
//         <div className="flex gap-2">
//           <select
//             className="modern-input flex-1"
//             onChange={(e) => handleChange("sector", e.target.value)}
//           >
//             <option value="">Select Sector</option>
//             {sectors.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>

//           <button
//             onClick={() => {
//               if (newSector && !sectors.includes(newSector)) {
//                 setSectors([...sectors, newSector]);
//                 setNewSector("");
//               }
//             }}
//             className="bg-blue-600 text-white px-3 rounded-lg"
//           >
//             +
//           </button>
//         </div>

//         <input
//           placeholder="Add New Sector"
//           value={newSector}
//           onChange={(e) => setNewSector(e.target.value)}
//           className="modern-input"
//         />

//         {/* Department */}
//         <div className="flex gap-2">
//           <select
//             className="modern-input flex-1"
//             onChange={(e) => handleChange("department", e.target.value)}
//           >
//             <option value="">Select Department</option>
//             {departments.map((d) => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>

//           <button
//             onClick={() => {
//               if (newDepartment && !departments.includes(newDepartment)) {
//                 setDepartments([...departments, newDepartment]);
//                 setNewDepartment("");
//               }
//             }}
//             className="bg-blue-600 text-white px-3 rounded-lg"
//           >
//             +
//           </button>
//         </div>

//         <input
//           placeholder="Add New Department"
//           value={newDepartment}
//           onChange={(e) => setNewDepartment(e.target.value)}
//           className="modern-input"
//         />
//          {/* Total Length */}
//         <div className="relative">
//           <input
//             type="number"
//             step="0.01"
//             placeholder="Total Length"
//             value={form.totalLength}
//             onChange={(e) => handleChange("totalLength", e.target.value)}
//             className="modern-input pr-12"
//           />
//           <span className="absolute right-4 top-3 text-gray-500 text-sm">
//             km
//           </span>
//         </div>

//         {/* Workorder Cost */}
//         <div className="relative">
//           <input
//             type="number"
//             placeholder="Workorder Cost"
//             value={form.cost}
//             onChange={(e) => handleChange("cost", e.target.value)}
//             className="modern-input pr-16"
//           />
//           <span className="absolute right-4 top-3 text-gray-500 text-sm">
//             Lakhs
//           </span>
//         </div>

//         {/* Dates */}
//         <input type="date"
//           value={form.loaDate}
//           onChange={(e) => handleChange("loaDate", e.target.value)}
//           className="modern-input" />

//         <input type="date"
//           value={form.completionDate}
//           onChange={(e) => handleChange("completionDate", e.target.value)}
//           className="modern-input" />

//       </div>
      

//       {/* ================= ACTIVITIES DROPDOWN ================= */}
//       <div className="bg-white p-8 rounded-3xl shadow-lg border">
//   <h3 className="font-semibold text-lg mb-6">
//     Activities
//   </h3>

//   {/* ================= ADD ACTIVITY DROPDOWN ================= */}
//   <div className="flex gap-3 mb-6">
//     <select
//       className="modern-input"
//       value={selectedActivity}
//       onChange={(e) => setSelectedActivity(e.target.value)}
//     >
//       <option value="">Select Activity</option>

//       {/* 🔥 Remove already selected activities */}
//       {defaultActivities
//         .filter((a) => !form.activities.includes(a))
//         .map((a) => (
//           <option key={a}>{a}</option>
//         ))}
//     </select>

//     <button
//       onClick={() => {
//         if (selectedActivity) {
//           setForm({
//             ...form,
//             activities: [...form.activities, selectedActivity]
//           });
//           setSelectedActivity("");
//         }
//       }}
//       className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl shadow-md transition"
//     >
//       Add
//     </button>
//   </div>

//   {/* ================= SELECTED ACTIVITIES ================= */}
//   {form.activities.map((act) => (
//     <motion.div
//       key={act}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="mb-4 border rounded-2xl p-4 bg-gray-50 shadow-sm"
//     >
//       {/* Activity Header */}
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={() =>
//           setExpandedActivity(
//             expandedActivity === act ? null : act
//           )
//         }
//       >
//         <div>
//           <span className="font-medium">{act}</span>

//           {/* 🔥 Sub activity count */}
//           <span className="text-xs text-gray-500 ml-2">
//             ({(subActivitiesMap[act] || []).length} Sub)
//           </span>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setSubActivityModal(act);
//             }}
//             className="text-blue-600 text-sm underline"
//           >
//             + Sub
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setForm({
//                 ...form,
//                 activities: form.activities.filter(
//                   (a) => a !== act
//                 )
//               });

//               const updatedMap = { ...subActivitiesMap };
//               delete updatedMap[act];
//               setSubActivitiesMap(updatedMap);
//             }}
//             className="text-red-500 text-sm"
//           >
//             Remove
//           </button>
//         </div>
//       </div>

//       {/* ================= SUB ACTIVITY DROPDOWN ================= */}
//       {expandedActivity === act && (
//         <div className="mt-4 pl-4 border-l-2 border-indigo-200">
//           {(subActivitiesMap[act] || []).length === 0 && (
//             <p className="text-sm text-gray-400">
//               No Sub Activities Added
//             </p>
//           )}

//           {(subActivitiesMap[act] || []).map((sub, i) => (
//             <div
//               key={i}
//               className="flex justify-between items-center text-sm text-gray-700 mb-2"
//             >
//               <span>• {sub}</span>

//               <button
//                 onClick={() => {
//                   const updatedSubs =
//                     subActivitiesMap[act].filter(
//                       (s) => s !== sub
//                     );

//                   setSubActivitiesMap({
//                     ...subActivitiesMap,
//                     [act]: updatedSubs
//                   });
//                 }}
//                 className="text-red-400 text-xs"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   ))}
// </div>

//       {/* ================= SUB ACTIVITY MODAL ================= */}
//      {subActivityModal && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <motion.div
//       initial={{ scale: 0.8 }}
//       animate={{ scale: 1 }}
//       className="bg-white p-6 rounded-2xl w-96 shadow-xl"
//     >
//       <h3 className="font-semibold mb-4">
//         Add Sub-Activity for {subActivityModal}
//       </h3>

//       <input
//         className="modern-input"
//         placeholder="Sub Activity Name"
//         value={subActivityInput}
//         onChange={(e) =>
//           setSubActivityInput(e.target.value)
//         }
//       />

//       <div className="flex justify-end gap-3 mt-6">
//         <button
//           onClick={() => {
//             setSubActivityModal(null);
//             setSubActivityInput("");
//           }}
//           className="px-4 py-2 bg-gray-200 rounded-lg"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={() => {
//             if (!subActivityInput) return;

//             setSubActivitiesMap({
//               ...subActivitiesMap,
//               [subActivityModal]: [
//                 ...(subActivitiesMap[
//                   subActivityModal
//                 ] || []),
//                 subActivityInput
//               ]
//             });

//             setSubActivityInput("");
//             setSubActivityModal(null);
//           }}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//         >
//           Add
//         </button>
//       </div>
//     </motion.div>
//   </div>
// )}

//       {/* ================= SUBMIT ================= */}
//       <button
//         onClick={handleSubmit}
//         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
//       >
//         Create Project
//       </button>

//       {/* ================= MODERN INPUT STYLE ================= */}
//       <style jsx>{`
//         .modern-input {
//           border: 1px solid #e5e7eb;
//           border-radius: 14px;
//           padding: 12px 16px;
//           width: 100%;
//           background: #f9fafb;
//           transition: 0.2s ease;
//         }
//         .modern-input:focus {
//           outline: none;
//           border-color: #6366f1;
//           background: white;
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
//         }
//       `}</style>
//     </motion.div>
//   );
// };

// export default CreateProject;



import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addProject } from "./projectSlice";
import { useNavigate } from "react-router-dom";

const MASTER_ACTIVITIES = [
  {
    name: "Field Team Mobilization Advance",
    subActivities: [{ name: "Mobilization", unit: "Complete" }],
  },
  {
    name: "Field Activities",
    subActivities: [
      { name: "Topo Survey", unit: "Km" },
      { name: "Traffic Survey and Soil Sampling", unit: "Nos." },
      { name: "Geotech Investigations", unit: "Nos." },
      { name: "FWD", unit: "Km" },
    ],
  },
  {
    name: "Design Scope",
    subActivities: [
      { name: "TCS", unit: "Nos." },
      { name: "MCW", unit: "Km" },
      { name: "Cross Road", unit: "Nos." },
      { name: "Service Road", unit: "Km" },
      { name: "Slip Road", unit: "Km" },
      { name: "Interchange", unit: "Km" },
      { name: "PDR", unit: "Complete" },
      { name: "DBR", unit: "Complete" },
      { name: "Drain", unit: "Km" },
      { name: "Miscellaneous Highway", unit: "Percentage" },
      { name: "Signage", unit: "Km" },
      { name: "Junction Box", unit: "Nos." },
      { name: "Box Culverts", unit: "Nos." },
      { name: "Pipe Culverts", unit: "Nos." },
      { name: "FO", unit: "Nos." },
      { name: "MNB", unit: "Nos." },
      { name: "MJB", unit: "Nos." },
      { name: "ROB", unit: "Nos." },
      { name: "FOB", unit: "Nos." },
      { name: "VUP", unit: "Nos." },
      { name: "VOP", unit: "Nos." },
      { name: "SVUP", unit: "Nos." },
      { name: "LVUP", unit: "Nos." },
      { name: "RUB", unit: "Nos." },
      { name: "PUP", unit: "Nos." },
      { name: "Tunnel Design", unit: "Complete" },
      { name: "Cut and Cover Design", unit: "Complete" },
      { name: "Slope Protection", unit: "Km" },
      { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "Complete" },
      { name: "Miscellaneous Structure", unit: "Percentage" },
      { name: "Approval from Proof and Safety", unit: "Percentage" },
      { name: "Approval from Authority", unit: "Percentage" },
    ],
  },
];

const companies = [
  { name: "CivilMantra ConsAi Ltd", logo: "/civilmantra.png" },
  { name: "Saptagon Asia Pvt Ltd", logo: "/saptagon.png" },
];

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    name: "",
    shortName: "",
    company: "",
    subCompany: "",
    location: "",
    sector: "",
    department: "",
    totalLength: "",
    cost: "",
    loaDate: "",
    completionDate: "",
    activities: [],
  });

  const [sectors, setSectors] = useState(["Highway", "Bridge", "Metro"]);
  const [departments, setDepartments] = useState(["Execution", "Planning"]);
  const [newSector, setNewSector] = useState("");
  const [newDepartment, setNewDepartment] = useState("");

  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.code || !form.name || !form.shortName) {
      alert("Please fill mandatory fields");
      return false;
    }
    if (!form.company) {
      alert("Select Company");
      return false;
    }
    if (form.totalLength <= 0) {
      alert("Invalid Total Length");
      return false;
    }
    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!validate()) return;

    const formattedActivities = selectedActivities.map((actName) => {
      const activityObj = MASTER_ACTIVITIES.find((a) => a.name === actName);

      return {
        id: actName + Date.now(),
        name: actName,
        completed: false,
        subActivities: activityObj.subActivities.map((sub) => ({
          id: sub.name + Date.now(),
          name: sub.name,
          unit: sub.unit,
          completed: false,
        })),
      };
    });

    dispatch(addProject({ ...form, activities: formattedActivities }));
    navigate("/projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <h2 className="text-3xl font-bold text-gray-800">Create New Project</h2>

      {/* ================= FORM SECTION ================= */}
      <div className="bg-white rounded-3xl shadow-xl p-10 grid md:grid-cols-2 gap-6 border">
        {[
          { label: "Project Code *", key: "code" },
          { label: "Project Name *", key: "name" },
          { label: "Short Name *", key: "shortName" },
          { label: "Location", key: "location" },
        ].map((field) => (
          <input
            key={field.key}
            placeholder={field.label}
            value={form[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="modern-input"
          />
        ))}

        {/* Company Selection */}
        <div>
          <select
            className="modern-input"
            onChange={(e) => handleChange("company", e.target.value)}
            value={form.company}
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {form.company && (
            <img
              src={form.company.includes("CivilMantra") ? "/civilmantra.png" : "/saptagon.png"}
              alt="logo"
              className="h-12 mt-3 rounded"
            />
          )}
        </div>

        {/* Sub Company Dropdown */}
        <div>
          <select
            className="modern-input"
            onChange={(e) => handleChange("subCompany", e.target.value)}
            value={form.subCompany}
          >
            <option value="">Select Sub Company</option>
            {companies.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sector with Add Button */}
        <div className="flex gap-2">
          <select
            className="modern-input flex-1"
            onChange={(e) => handleChange("sector", e.target.value)}
            value={form.sector}
          >
            <option value="">Select Sector</option>
            {sectors.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (newSector && !sectors.includes(newSector)) {
                setSectors([...sectors, newSector]);
                setNewSector("");
              }
            }}
            className="bg-blue-600 text-white px-3 rounded-lg"
          >
            +
          </button>
        </div>

        <input
          placeholder="Add New Sector"
          value={newSector}
          onChange={(e) => setNewSector(e.target.value)}
          className="modern-input"
        />

        {/* Department with Add Button */}
        <div className="flex gap-2">
          <select
            className="modern-input flex-1"
            onChange={(e) => handleChange("department", e.target.value)}
            value={form.department}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (newDepartment && !departments.includes(newDepartment)) {
                setDepartments([...departments, newDepartment]);
                setNewDepartment("");
              }
            }}
            className="bg-blue-600 text-white px-3 rounded-lg"
          >
            +
          </button>
        </div>

        <input
          placeholder="Add New Department"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="modern-input"
        />

        {/* Total Length */}
        <div className="relative">
          <input
            type="number"
            step="0.01"
            placeholder="Total Length"
            value={form.totalLength}
            onChange={(e) => handleChange("totalLength", e.target.value)}
            className="modern-input pr-12"
          />
          <span className="absolute right-4 top-3 text-gray-500 text-sm">km</span>
        </div>

        {/* Workorder Cost */}
        <div className="relative">
          <input
            type="number"
            placeholder="Workorder Cost"
            value={form.cost}
            onChange={(e) => handleChange("cost", e.target.value)}
            className="modern-input pr-16"
          />
          <span className="absolute right-4 top-3 text-gray-500 text-sm">Lakhs</span>
        </div>

        {/* Dates */}
        <input
          type="date"
          value={form.loaDate}
          onChange={(e) => handleChange("loaDate", e.target.value)}
          className="modern-input"
        />
        <input
          type="date"
          value={form.completionDate}
          onChange={(e) => handleChange("completionDate", e.target.value)}
          className="modern-input"
        />
      </div>

      {/* ================= ACTIVITIES SECTION ================= */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border">
        <h3 className="font-semibold text-lg mb-6">Select Project Activities</h3>

        {/* ================= MULTI SELECT GRID ================= */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {MASTER_ACTIVITIES.map((activity) => {
            const isSelected = selectedActivities.includes(activity.name);
            return (
              <div
                key={activity.name}
                onClick={() => {
                  if (isSelected) {
                    setSelectedActivities(selectedActivities.filter((a) => a !== activity.name));
                  } else {
                    setSelectedActivities([...selectedActivities, activity.name]);
                  }
                }}
                className={`cursor-pointer p-4 rounded-2xl border transition shadow-sm
                  ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-50 hover:bg-indigo-50 text-gray-700"
                  }
                `}
              >
                <p className="font-medium text-center">{activity.name}</p>
              </div>
            );
          })}
        </div>

        {/* ================= SHOW SELECTED WITH AUTO SUBACTIVITIES ================= */}
        {selectedActivities.map((actName) => {
          const activityObj = MASTER_ACTIVITIES.find((a) => a.name === actName);
          return (
            <motion.div
              key={actName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 border rounded-2xl p-6 bg-gray-50 shadow-inner"
            >
              <h4 className="font-semibold mb-4 text-indigo-600 flex justify-between items-center">
                {actName}
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {activityObj.subActivities.length} Sub-activities
                </span>
              </h4>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activityObj.subActivities.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {sub.unit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= SUBMIT BUTTON ================= */}
      <div className="flex justify-center pb-10">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 font-bold text-lg"
        >
          Create Project
        </button>
      </div>

      {/* ================= MODERN INPUT STYLE ================= */}
      <style jsx>{`
        .modern-input {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px 16px;
          width: 100%;
          background: #f9fafb;
          transition: 0.2s ease;
        }
        .modern-input:focus {
          outline: none;
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </motion.div>
  );
};

export default CreateProject;