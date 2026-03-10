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
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addProject } from "./projectSlice";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CheckCircle,
  X,
  Edit3,
  Trash2,
  Save
} from "lucide-react";

const MASTER_ACTIVITIES = [
  {
    name: "Field Team Mobilization Advance",
    subActivities: [{ name: "Mobilization", unit: "Complete", defaultPlanned: 1 }],
  },
  {
    name: "Field Activities",
    subActivities: [
      { name: "Topo Survey", unit: "Km", defaultPlanned: 50 },
      { name: "Traffic Survey and Soil Sampling", unit: "Nos.", defaultPlanned: 100 },
      { name: "Geotech Investigations", unit: "Nos.", defaultPlanned: 30 },
      { name: "FWD", unit: "Km", defaultPlanned: 100 },
    ],
  },
  {
    name: "Design Scope",
    subActivities: [
      { name: "TCS", unit: "Nos.", defaultPlanned: 10 },
      { name: "MCW", unit: "Km", defaultPlanned: 100 },
      { name: "Cross Road", unit: "Nos.", defaultPlanned: 15 },
      { name: "Service Road", unit: "Km", defaultPlanned: 20 },
      { name: "Slip Road", unit: "Km", defaultPlanned: 15 },
      { name: "Interchange", unit: "Km", defaultPlanned: 5 },
      { name: "PDR", unit: "Complete", defaultPlanned: 1 },
      { name: "DBR", unit: "Complete", defaultPlanned: 1 },
      { name: "Drain", unit: "Km", defaultPlanned: 80 },
      { name: "Miscellaneous Highway", unit: "Percentage", defaultPlanned: 100 },
      { name: "Signage", unit: "Km", defaultPlanned: 100 },
      { name: "Junction Box", unit: "Nos.", defaultPlanned: 25 },
      { name: "Box Culverts", unit: "Nos.", defaultPlanned: 20 },
      { name: "Pipe Culverts", unit: "Nos.", defaultPlanned: 40 },
      { name: "FO", unit: "Nos.", defaultPlanned: 5 },
      { name: "MNB", unit: "Nos.", defaultPlanned: 3 },
      { name: "MJB", unit: "Nos.", defaultPlanned: 4 },
      { name: "ROB", unit: "Nos.", defaultPlanned: 2 },
      { name: "FOB", unit: "Nos.", defaultPlanned: 3 },
      { name: "VUP", unit: "Nos.", defaultPlanned: 2 },
      { name: "VOP", unit: "Nos.", defaultPlanned: 2 },
      { name: "SVUP", unit: "Nos.", defaultPlanned: 1 },
      { name: "LVUP", unit: "Nos.", defaultPlanned: 1 },
      { name: "RUB", unit: "Nos.", defaultPlanned: 1 },
      { name: "PUP", unit: "Nos.", defaultPlanned: 1 },
      { name: "Tunnel Design", unit: "Complete", defaultPlanned: 1 },
      { name: "Cut and Cover Design", unit: "Complete", defaultPlanned: 1 },
      { name: "Slope Protection", unit: "Km", defaultPlanned: 30 },
      { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "Complete", defaultPlanned: 1 },
      { name: "Miscellaneous Structure", unit: "Percentage", defaultPlanned: 100 },
      { name: "Approval from Proof and Safety", unit: "Percentage", defaultPlanned: 100 },
      { name: "Approval from Authority", unit: "Percentage", defaultPlanned: 100 },
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
    directorProposalDate: "",
    projectConfirmationDate: "",
    activities: [],
  });

  const [sectors, setSectors] = useState(["Highway", "Bridge", "Metro", "Railway", "Building"]);
  const [departments, setDepartments] = useState(["Execution", "Planning", "Design", "Quality", "Safety"]);
  const [newSector, setNewSector] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [activityDates, setActivityDates] = useState({});
  
  // New state for dynamic activities
  const [customActivities, setCustomActivities] = useState([]);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
  const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
  const [newActivityName, setNewActivityName] = useState("");
  const [newSubActivity, setNewSubActivity] = useState({
    name: "",
    unit: "Km",
    defaultPlanned: 0
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleActivityDateChange = (activityName, field, value) => {
    setActivityDates({
      ...activityDates,
      [activityName]: {
        ...activityDates[activityName],
        [field]: value
      }
    });
  };

  // Add new activity
  const handleAddActivity = () => {
    if (!newActivityName.trim()) {
      alert("Please enter activity name");
      return;
    }

    const newActivity = {
      name: newActivityName,
      subActivities: [],
      isCustom: true
    };

    setCustomActivities([...customActivities, newActivity]);
    setNewActivityName("");
    setShowAddActivityModal(false);
  };

  // Add new sub-activity
  const handleAddSubActivity = () => {
    if (!newSubActivity.name.trim()) {
      alert("Please enter sub-activity name");
      return;
    }
    if (newSubActivity.defaultPlanned <= 0) {
      alert("Please enter planned quantity");
      return;
    }

    const updatedCustomActivities = customActivities.map(act => {
      if (act.name === selectedActivityForSub) {
        return {
          ...act,
          subActivities: [
            ...act.subActivities,
            { 
              name: newSubActivity.name, 
              unit: newSubActivity.unit, 
              defaultPlanned: parseFloat(newSubActivity.defaultPlanned) 
            }
          ]
        };
      }
      return act;
    });

    setCustomActivities(updatedCustomActivities);
    setNewSubActivity({ name: "", unit: "Km", defaultPlanned: 0 });
    setShowAddSubActivityModal(false);
    setSelectedActivityForSub(null);
  };

  // Delete custom activity
  const handleDeleteActivity = (activityName) => {
    setCustomActivities(customActivities.filter(a => a.name !== activityName));
    setSelectedActivities(selectedActivities.filter(a => a !== activityName));
    const newDates = { ...activityDates };
    delete newDates[activityName];
    setActivityDates(newDates);
  };

  // Delete custom sub-activity
  const handleDeleteSubActivity = (activityName, subActivityName) => {
    const updatedCustomActivities = customActivities.map(act => {
      if (act.name === activityName) {
        return {
          ...act,
          subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
        };
      }
      return act;
    });
    setCustomActivities(updatedCustomActivities);
  };

  // Combine master and custom activities
  const getAllActivities = () => {
    return [...MASTER_ACTIVITIES, ...customActivities];
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.code || !form.name || !form.shortName) {
      alert("Please fill mandatory fields: Project Code, Name, and Short Name");
      return false;
    }
    if (!form.company) {
      alert("Please select a Company");
      return false;
    }
    if (form.totalLength <= 0) {
      alert("Please enter a valid Total Length");
      return false;
    }
    if (selectedActivities.length === 0) {
      alert("Please select at least one activity");
      return false;
    }
    
    // Validate activity dates
    for (const activityName of selectedActivities) {
      const dates = activityDates[activityName];
      if (!dates?.startDate || !dates?.endDate) {
        alert(`Please set start and end dates for ${activityName}`);
        return false;
      }
      if (new Date(dates.startDate) > new Date(dates.endDate)) {
        alert(`End date must be after start date for ${activityName}`);
        return false;
      }
    }
    
    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!validate()) return;

    const allActivities = getAllActivities();
    
    const formattedActivities = selectedActivities.map((actName) => {
      const activityObj = allActivities.find((a) => a.name === actName);
      const dates = activityDates[actName];

      return {
        id: `${actName.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: actName,
        startDate: dates.startDate,
        endDate: dates.endDate,
        progress: 0,
        subActivities: activityObj.subActivities.map((sub) => ({
          id: `${sub.name.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: sub.name,
          unit: sub.unit,
          plannedQty: sub.defaultPlanned || 0,
          completedQty: 0,
          progress: 0,
          startDate: dates.startDate,
          endDate: dates.endDate,
          status: "PENDING",
        })),
      };
    });

    dispatch(addProject({ 
      ...form, 
      activities: formattedActivities 
    }));
    
    navigate("/projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
    >
      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddActivityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Activity</h3>
                <button onClick={() => setShowAddActivityModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter activity name"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                className="w-full p-3 border rounded-xl mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Sub-Activity Modal */}
      <AnimatePresence>
        {showAddSubActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSubActivityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Sub-Activity to {selectedActivityForSub}</h3>
                <button onClick={() => setShowAddSubActivityModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Sub-activity name"
                  value={newSubActivity.name}
                  onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})}
                  className="w-full p-3 border rounded-xl"
                />
                
                <select
                  value={newSubActivity.unit}
                  onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="Km">Kilometer (Km)</option>
                  <option value="Nos.">Numbers (Nos.)</option>
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Complete">Complete</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Planned quantity"
                  value={newSubActivity.defaultPlanned}
                  onChange={(e) => setNewSubActivity({...newSubActivity, defaultPlanned: e.target.value})}
                  className="w-full p-3 border rounded-xl"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddSubActivityModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubActivity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Sub-Activity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create New Project
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText size={18} />
          <span>Complete all required fields *</span>
        </div>
      </div>

      {/* ================= FORM SECTION ================= */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Basic Information
            </h3>
          </div>

          {[
            { label: "Project Code *", key: "code", icon: "📋" },
            { label: "Project Name *", key: "name", icon: "🏗️" },
            { label: "Short Name *", key: "shortName", icon: "🔤" },
            { label: "Location", key: "location", icon: "📍" },
          ].map((field) => (
            <div key={field.key} className="relative">
              <span className="absolute left-3 top-3 text-lg">{field.icon}</span>
              <input
                placeholder={field.label}
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
            </div>
          ))}

          {/* Company Selection */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-lg">🏢</span>
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
              onChange={(e) => handleChange("company", e.target.value)}
              value={form.company}
            >
              <option value="">Select Company *</option>
              {companies.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Company Dropdown */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-lg">🏭</span>
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
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
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-lg">📊</span>
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
                onChange={(e) => handleChange("sector", e.target.value)}
                value={form.sector}
              >
                <option value="">Select Sector</option>
                {sectors.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (newSector && !sectors.includes(newSector)) {
                  setSectors([...sectors, newSector]);
                  setNewSector("");
                }
              }}
              className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
              title="Add new sector"
            >
              <Plus size={18} />
            </button>
          </div>

          <input
            placeholder="Add New Sector"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />

          {/* Department with Add Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-lg">👥</span>
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
                onChange={(e) => handleChange("department", e.target.value)}
                value={form.department}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (newDepartment && !departments.includes(newDepartment)) {
                  setDepartments([...departments, newDepartment]);
                  setNewDepartment("");
                }
              }}
              className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
              title="Add new department"
            >
              <Plus size={18} />
            </button>
          </div>

          <input
            placeholder="Add New Department"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />

          {/* Project Specifications */}
          <div className="col-span-full mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-600 rounded-full"></div>
              Project Specifications
            </h3>
          </div>

          {/* Total Length */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-lg">📏</span>
            <input
              type="number"
              step="0.01"
              placeholder="Total Length"
              value={form.totalLength}
              onChange={(e) => handleChange("totalLength", e.target.value)}
              className="w-full pl-10 pr-16 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <span className="absolute right-4 top-3 text-gray-500 text-sm font-medium">km</span>
          </div>

          {/* Workorder Cost */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-lg">💰</span>
            <input
              type="number"
              placeholder="Workorder Cost"
              value={form.cost}
              onChange={(e) => handleChange("cost", e.target.value)}
              className="w-full pl-10 pr-16 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <span className="absolute right-4 top-3 text-gray-500 text-sm font-medium">Lakhs</span>
          </div>

          {/* Key Dates Section */}
          <div className="col-span-full mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
              <Calendar size={18} className="text-purple-600" />
              Key Dates
            </h3>
          </div>

          {/* Date Inputs with Labels */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              LOA Date
            </label>
            <input
              type="date"
              value={form.loaDate}
              onChange={(e) => handleChange("loaDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Completion Date
            </label>
            <input
              type="date"
              value={form.completionDate}
              onChange={(e) => handleChange("completionDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Director Proposal Date
            </label>
            <input
              type="date"
              value={form.directorProposalDate}
              onChange={(e) => handleChange("directorProposalDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              Project Confirmation Date
            </label>
            <input
              type="date"
              value={form.projectConfirmationDate}
              onChange={(e) => handleChange("projectConfirmationDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* ================= ACTIVITIES SECTION ================= */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle size={24} className="text-blue-600" />
            Select Project Activities
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({selectedActivities.length} selected)
            </span>
          </h3>
          
          {/* Add Activity Button */}
          <button
            onClick={() => setShowAddActivityModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Activity
          </button>
        </div>

        {/* Activity Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {getAllActivities().map((activity) => {
            const isSelected = selectedActivities.includes(activity.name);
            const isCustom = activity.isCustom;
            
            return (
              <div key={activity.name} className="relative group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedActivities(selectedActivities.filter((a) => a !== activity.name));
                      const newDates = { ...activityDates };
                      delete newDates[activity.name];
                      setActivityDates(newDates);
                    } else {
                      setSelectedActivities([...selectedActivities, activity.name]);
                    }
                  }}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all shadow-sm
                    ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
                    }
                  `}
                >
                  <p className="font-semibold text-center">{activity.name}</p>
                  <p className={`text-xs text-center mt-2 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                    {activity.subActivities.length} sub-activities
                  </p>
                  {isCustom && (
                    <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      Custom
                    </span>
                  )}
                </motion.div>
                
                {/* Delete button for custom activities */}
                {isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteActivity(activity.name);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete activity"
                  >
                    <X size={14} />
                  </button>
                )}
                
                {/* Add Sub-Activity button */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedActivityForSub(activity.name);
                      setShowAddSubActivityModal(true);
                    }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <Plus size={12} />
                    Add Sub-Activity
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Activities with Date Configuration */}
        <AnimatePresence>
          {selectedActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                Configure Activity Dates
              </h4>

              {selectedActivities.map((actName) => {
                const activityObj = getAllActivities().find((a) => a.name === actName);
                const isExpanded = expandedActivity === actName;
                const isCustom = activityObj?.isCustom;
                
                return (
                  <motion.div
                    key={actName}
                    layout
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50"
                  >
                    {/* Activity Header */}
                    <div
                      onClick={() => setExpandedActivity(isExpanded ? null : actName)}
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-gray-400'}`} />
                        <h5 className="font-semibold text-gray-800">{actName}</h5>
                        {isCustom && (
                          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                            Custom
                          </span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {activityObj?.subActivities.length || 0} sub-activities
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Date Summary */}
                        {activityDates[actName]?.startDate && activityDates[actName]?.endDate && (
                          <div className="text-xs text-gray-500 hidden md:block">
                            {new Date(activityDates[actName].startDate).toLocaleDateString()} → {new Date(activityDates[actName].endDate).toLocaleDateString()}
                          </div>
                        )}
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-200 bg-white p-6"
                        >
                          {/* Activity Dates Configuration */}
                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-600">Activity Start Date *</label>
                              <input
                                type="date"
                                value={activityDates[actName]?.startDate || ''}
                                onChange={(e) => handleActivityDateChange(actName, 'startDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-600">Activity End Date *</label>
                              <input
                                type="date"
                                value={activityDates[actName]?.endDate || ''}
                                onChange={(e) => handleActivityDateChange(actName, 'endDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          {/* Sub-activities Preview */}
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium text-gray-700">Sub-activities:</h6>
                            <button
                              onClick={() => {
                                setSelectedActivityForSub(actName);
                                setShowAddSubActivityModal(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Plus size={14} />
                              Add Sub-Activity
                            </button>
                          </div>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {activityObj?.subActivities.map((sub) => (
                              <div
                                key={sub.name}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100 group"
                              >
                                <span className="text-sm text-gray-700">{sub.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {sub.unit}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {sub.defaultPlanned} {sub.unit}
                                  </span>
                                  {activityObj.isCustom && (
                                    <button
                                      onClick={() => handleDeleteSubActivity(actName, sub.name)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X size={14} className="text-red-500" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl"
          >
            <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p>Select activities above to configure dates and view sub-activities</p>
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
            >
              <Plus size={16} />
              Or create a new custom activity
            </button>
          </motion.div>
        )}
      </div>

      {/* ================= SUBMIT BUTTON ================= */}
      <div className="flex justify-center pb-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-16 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 font-bold text-xl flex items-center gap-3"
        >
          <CheckCircle size={24} />
          Create Project
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateProject;