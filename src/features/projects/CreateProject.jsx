
// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch } from "react-redux";
// import { addProject } from "./projectSlice";
// import { useNavigate } from "react-router-dom";
// import { 
//   Calendar, 
//   Plus,  
//   ChevronDown, 
//   ChevronUp, 
//   FileText, 
//   CheckCircle,
//   X,
//   Trash2,
//   Info,
//   Search,
//   Building2,
//   MapPin,
//   Ruler,
//   IndianRupee,
//   Briefcase,
//   Users,
//   Hash,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
//   Percent,
//   Edit3
// } from "lucide-react";

// // Make MASTER_ACTIVITIES mutable by copying to state
// const INITIAL_MASTER_ACTIVITIES = [
//   {
//     name: "Field Team Mobilization Advance",
//     subActivities: [{ name: "Mobilization", unit: "status" }],
//   },
//   {
//     name: "Field Activities",
//     subActivities: [
//       { name: "Topo Survey", unit: "Km" },
//       { name: "Traffic Survey and Soil Sampling", unit: "Nos." },
//       { name: "Geotech Investigations", unit: "Nos." },
//       { name: "FWD", unit: "Km" },
//     ],
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
//       { name: "PDR", unit: "status" },
//       { name: "DBR", unit: "status" },
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
//       { name: "Tunnel Design", unit: "status" },
//       { name: "Cut and Cover Design", unit: "status" },
//       { name: "Slope Protection", unit: "Km" },
//       { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "status" },
//       { name: "Miscellaneous Structure", unit: "Percentage" },
//       { name: "Approval from Proof and Safety", unit: "Percentage" },
//       { name: "Approval from Authority", unit: "Percentage" },
//     ],
//   },
// ];

// const companies = [
//   { name: "CivilMantra ConsAi Ltd", logo: "/civilmantra.png" },
//   { name: "Saptagon Asia Pvt Ltd", logo: "/saptagon.png" },
// ];

// const CreateProject = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Form state with correct date order
//   const [form, setForm] = useState({
//     code: "",
//     name: "",
//     shortName: "",
//     company: "CivilMantra ConsAi Ltd",
//     subCompany: "",
//     location: "",
//     sector: "",
//     department: "",
//     totalLength: "",
//     cost: "",
//     directorProposalDate: "", // First
//     projectConfirmationDate: "", // Second
//     loaDate: "", // Third
//     completionDate: "", // Fourth/Last
//     activities: [],
//   });

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   // Search and filter states
//   const [sectors, setSectors] = useState(["Highway", "Bridge", "Metro", "Railway", "Building"]);
//   const [clients, setClients] = useState([
//     "A S Traders", "AGIPL", "Ajay Parkash", "AMAG", "Ambar Infra", "Ambay Infra",
//     "Amit Chopra", "Apco", "Arcons", "Arnac", "Barbrik", "BCC", "Beigh Construction",
//     "Bharat", "BI", "BNA", "BRO", "BRS", "CDS", "Ceigall", "Chaudhary Construction",
//     "Chopra/Shreya", "Ciegall", "Classic Infra", "Classic Infra / Neeraj Agarwal",
//     "CS Construction", "DCC", "Devyash", "Devyash/Digvijay", "Dhar Construction",
//     "Dhariwal", "Dhariwal/MRG", "DHD", "Dhingra Brothers", "DMR", "DPS", "DRA",
//     "Dynasty Promoters", "Ganesh Builders", "Ganesh Garia", "Garg Sons",
//     "Gaurav Aehlawat", "Gawar", "GE", "Geetech", "GHV", "Giriraj Construction",
//     "Griffin", "GRTC", "GSC", "HG Infra", "Hillways", "HP Madhukar", "Imtiaz",
//     "ISC", "Jandu", "Kaluwala", "Kamal Contractor", "KCC", "KCVR", "Keystone",
//     "KG Gupta", "KRC", "Krishna Projects", "Mahavir Gupta & sons (RKC)",
//     "Mahavir Sharma / Sumit Singh", "Mann Builders", "MCL", "Mosh Vari", "MRG",
//     "MSC", "MSC HP", "Nadbindu", "Nagyan", "Neeraj Cements", "NKG", "NU", "Oasis",
//     "Pankaj Kumar Goel", "Pappu prasad", "Peto Dumpum", "PNC", "PRA",
//     "Preeti Buildcon", "Preeti Buildicon", "PS Construction", "R&C", "Rahil Wazir",
//     "Raj Corporation", "Rajender singh", "Rajindra Construction", "Rajpath",
//     "Ravi Infra", "RCC", "Reliance", "RIPL", "RKC", "RL & Sons", "SAC", "SAC-RIPL",
//     "Sadbhav", "Sarvodya Infra", "Satish AG", "SCPL", "SGI", "Sharma Construction",
//     "Shri Mohangarh Const. Co.", "Singla", "Singla Construction", "SKS Infra",
//     "Skylark", "SMS Ltd", "Snal Infra", "SPL", "SRC-MSA JV", "SRM", "SS Builders",
//     "SS Builders/A Square", "Subash Agarwal", "Sunmaya", "Sunny Infra",
//     "Sunny Infra Projects Pvt Ltd", "Tejwant rai", "Terrain Infra", "TMAP",
//     "Topden Puning", "Tumas", "Uma Construction", "V&H", "Vindhya Company",
//     "Vindhya Construction", "Vishwakarma Enterprises", "VRC", "Notch"
//   ]);
  
//   // Search states
//   const [clientSearch, setClientSearch] = useState("");
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const clientDropdownRef = useRef(null);
  
//   const [newSector, setNewSector] = useState("");
//   const [newClient, setNewClient] = useState("");
  
//   // Activity states
//   const [masterActivities, setMasterActivities] = useState(INITIAL_MASTER_ACTIVITIES);
//   const [customActivities, setCustomActivities] = useState([]);
  
//   // Selected activities with percentage weightage
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [activityWeightages, setActivityWeightages] = useState({});
//   const [expandedActivity, setExpandedActivity] = useState(null);
//   const [activityDates, setActivityDates] = useState({});
  
//   // Sub-activity selection state
//   const [selectedSubActivities, setSelectedSubActivities] = useState({});
//   const [subActivityPlannedQtys, setSubActivityPlannedQtys] = useState({});
//   const [subActivityUnits, setSubActivityUnits] = useState({});
  
//   // Modal states
//   const [showAddActivityModal, setShowAddActivityModal] = useState(false);
//   const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
//   const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
//   const [newActivityName, setNewActivityName] = useState("");
//   const [newSubActivity, setNewSubActivity] = useState({
//     name: "",
//     unit: "Km"
//   });

//   // Handle resize for responsive
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close client dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
//         setShowClientDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter clients based on search
//   const filteredClients = clients.filter(client =>
//     client.toLowerCase().includes(clientSearch.toLowerCase())
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleActivityDateChange = (activityName, field, value) => {
//     setActivityDates(prev => ({
//       ...prev,
//       [activityName]: {
//         ...prev[activityName],
//         [field]: value
//       }
//     }));
//   };

//   const handleActivityWeightageChange = (activityName, value) => {
//     const numValue = parseFloat(value) || 0;
//     setActivityWeightages(prev => ({
//       ...prev,
//       [activityName]: numValue
//     }));
//   };

//   const handleSubActivitySelection = (activityName, subActivityName, checked) => {
//     setSelectedSubActivities(prev => {
//       const activitySubs = prev[activityName] || [];
//       if (checked) {
//         return {
//           ...prev,
//           [activityName]: [...activitySubs, subActivityName]
//         };
//       } else {
//         return {
//           ...prev,
//           [activityName]: activitySubs.filter(name => name !== subActivityName)
//         };
//       }
//     });
//   };

//   const handleSubActivityUnitChange = (activityName, subActivityName, unit) => {
//     setSubActivityUnits(prev => ({
//       ...prev,
//       [`${activityName}_${subActivityName}`]: unit
//     }));
//   };

//   const handleSubActivityPlannedQtyChange = (activityName, subActivityName, value) => {
//     const numValue = parseFloat(value) || 0;
//     setSubActivityPlannedQtys(prev => ({
//       ...prev,
//       [`${activityName}_${subActivityName}`]: numValue
//     }));
//   };

//   const handleAddActivity = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!newActivityName.trim()) {
//       alert("Please enter activity name");
//       return;
//     }

//     const newActivity = {
//       name: newActivityName,
//       subActivities: [],
//       isCustom: true
//     };

//     setCustomActivities(prev => [...prev, newActivity]);
//     setNewActivityName("");
//     setShowAddActivityModal(false);
//   };

//   const handleAddSubActivity = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!newSubActivity.name.trim()) {
//       alert("Please enter sub-activity name");
//       return;
//     }

//     const newSub = { 
//       name: newSubActivity.name, 
//       unit: newSubActivity.unit
//     };

//     const masterIndex = masterActivities.findIndex(act => act.name === selectedActivityForSub);
    
//     if (masterIndex !== -1) {
//       setMasterActivities(prev => prev.map((act, index) => {
//         if (index === masterIndex) {
//           return {
//             ...act,
//             subActivities: [...act.subActivities, newSub]
//           };
//         }
//         return act;
//       }));
//     } else {
//       setCustomActivities(prev => prev.map(act => {
//         if (act.name === selectedActivityForSub) {
//           return {
//             ...act,
//             subActivities: [...act.subActivities, newSub]
//           };
//         }
//         return act;
//       }));
//     }

//     setNewSubActivity({ name: "", unit: "Km" });
//     setShowAddSubActivityModal(false);
//     setSelectedActivityForSub(null);
//   };

//   const handleDeleteActivity = (activityName) => {
//     if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
//       setCustomActivities(prev => prev.filter(a => a.name !== activityName));
//       setSelectedActivities(prev => prev.filter(a => a !== activityName));
      
//       // Clean up related state
//       const newWeightages = { ...activityWeightages };
//       delete newWeightages[activityName];
//       setActivityWeightages(newWeightages);
      
//       const newDates = { ...activityDates };
//       delete newDates[activityName];
//       setActivityDates(newDates);
      
//       const newSubSelections = { ...selectedSubActivities };
//       delete newSubSelections[activityName];
//       setSelectedSubActivities(newSubSelections);
//     }
//   };

//   const handleDeleteSubActivity = (activityName, subActivityName) => {
//     if (window.confirm(`Are you sure you want to delete sub-activity "${subActivityName}"?`)) {
      
//       const masterIndex = masterActivities.findIndex(act => act.name === activityName);
      
//       if (masterIndex !== -1) {
//         setMasterActivities(prev => prev.map(act => {
//           if (act.name === activityName) {
//             return {
//               ...act,
//               subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
//             };
//           }
//           return act;
//         }));
//       } else {
//         setCustomActivities(prev => prev.map(act => {
//           if (act.name === activityName) {
//             return {
//               ...act,
//               subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
//             };
//           }
//           return act;
//         }));
//       }

//       // Clean up related state
//       const key = `${activityName}_${subActivityName}`;
//       const newUnits = { ...subActivityUnits };
//       delete newUnits[key];
//       setSubActivityUnits(newUnits);
      
//       const newQtys = { ...subActivityPlannedQtys };
//       delete newQtys[key];
//       setSubActivityPlannedQtys(newQtys);
      
//       if (selectedSubActivities[activityName]) {
//         setSelectedSubActivities(prev => ({
//           ...prev,
//           [activityName]: prev[activityName].filter(name => name !== subActivityName)
//         }));
//       }
//     }
//   };

//   const getAllActivities = () => {
//     return [...masterActivities, ...customActivities];
//   };

//   const validateDates = () => {
//     const dates = [
//       { name: "Director Proposal", value: form.directorProposalDate },
//       { name: "Project Confirmation", value: form.projectConfirmationDate },
//       { name: "LOA", value: form.loaDate },
//       { name: "Completion", value: form.completionDate }
//     ];

//     // Check if dates are in correct order
//     for (let i = 0; i < dates.length - 1; i++) {
//       if (dates[i].value && dates[i + 1].value) {
//         if (new Date(dates[i].value) > new Date(dates[i + 1].value)) {
//           alert(`${dates[i].name} date must be before ${dates[i + 1].name} date`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const validate = () => {
//     if (!form.code || !form.name || !form.shortName) {
//       alert("Please fill mandatory fields: Project Code, Name, and Short Name");
//       return false;
//     }
//     if (!form.company) {
//       alert("Please select a Company");
//       return false;
//     }
//     if (!form.totalLength || form.totalLength <= 0) {
//       alert("Please enter a valid Total Length");
//       return false;
//     }
//     if (selectedActivities.length === 0) {
//       alert("Please select at least one activity");
//       return false;
//     }

//     // Validate activity weightages sum to 100
//     const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);
//     if (Math.abs(totalWeightage - 100) > 0.01) {
//       alert(`Total activity weightage must sum to 100%. Current total: ${totalWeightage}%`);
//       return false;
//     }

//     // Validate dates for each activity
//     for (const activityName of selectedActivities) {
//       const dates = activityDates[activityName];
//       if (!dates?.startDate || !dates?.endDate) {
//         alert(`Please set start and end dates for ${activityName}`);
//         return false;
//       }
//       if (new Date(dates.startDate) > new Date(dates.endDate)) {
//         alert(`End date must be after start date for ${activityName}`);
//         return false;
//       }
//     }

//     // Validate sub-activities for each selected activity
//     for (const activityName of selectedActivities) {
//       const activityObj = getAllActivities().find((a) => a.name === activityName);
//       const selectedSubs = selectedSubActivities[activityName] || [];
      
//       if (selectedSubs.length === 0) {
//         alert(`Please select at least one sub-activity for ${activityName}`);
//         return false;
//       }

//       // Validate planned quantities for selected sub-activities
//       for (const subName of selectedSubs) {
//         const key = `${activityName}_${subName}`;
//         const unit = subActivityUnits[key] || activityObj.subActivities.find(s => s.name === subName)?.unit || "Km";
//         const plannedQty = subActivityPlannedQtys[key];
        
//         if (unit !== "status" && (!plannedQty || plannedQty <= 0)) {
//           alert(`Please enter planned quantity for ${subName} in ${activityName}`);
//           return false;
//         }
//       }
//     }

//     // Validate date order
//     if (!validateDates()) {
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!validate()) return;

//     const allActivities = getAllActivities();
    
//     const formattedActivities = selectedActivities.map((actName, actIndex) => {
//       const activityObj = allActivities.find((a) => a.name === actName);
//       const dates = activityDates[actName];
//       const weightage = activityWeightages[actName] || 0;
//       const selectedSubs = selectedSubActivities[actName] || [];

//       return {
//         id: `a${actIndex + 1}_${Date.now()}`,
//         name: actName,
//         weightage: weightage,
//         startDate: dates.startDate,
//         endDate: dates.endDate,
//         progress: 0,
//         subActivities: selectedSubs.map((subName, subIndex) => {
//           const subObj = activityObj.subActivities.find(s => s.name === subName);
//           const key = `${actName}_${subName}`;
//           const unit = subActivityUnits[key] || subObj.unit;
//           const plannedQty = subActivityPlannedQtys[key] || 0;

//           return {
//             id: `s${actIndex + 1}_${subIndex + 1}_${Date.now()}`,
//             name: subName,
//             unit: unit,
//             plannedQty: unit !== "status" ? plannedQty : 1,
//             completedQty: 0,
//             progress: 0,
//             startDate: dates.startDate,
//             endDate: dates.endDate,
//             status: "PENDING",
//           };
//         }),
//       };
//     });

//     dispatch(addProject({ 
//       ...form, 
//       activities: formattedActivities 
//     }));
    
//     navigate("/projects");
//   };

//   const closeModal = (setter) => {
//     setter(false);
//   };

//   // Mobile step navigation
//   const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
//   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

//   // Calculate total weightage
//   const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-4 py-4 md:py-6"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Add Activity Modal */}
//       <AnimatePresence>
//         {showAddActivityModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => closeModal(setShowAddActivityModal)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <form onSubmit={handleAddActivity}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg md:text-xl font-bold">Add New Activity</h3>
//                   <button 
//                     type="button"
//                     onClick={() => closeModal(setShowAddActivityModal)}
//                     className="p-1 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Enter activity name"
//                   value={newActivityName}
//                   onChange={(e) => setNewActivityName(e.target.value)}
//                   className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base mb-4"
//                   autoFocus
//                 />
//                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={() => closeModal(setShowAddActivityModal)}
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
//                   >
//                     Add Activity
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Sub-Activity Modal */}
//       <AnimatePresence>
//         {showAddSubActivityModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => closeModal(setShowAddSubActivityModal)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <form onSubmit={handleAddSubActivity}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg md:text-xl font-bold">Add Sub-Activity</h3>
//                   <button
//                     type="button"
//                     onClick={() => closeModal(setShowAddSubActivityModal)}
//                     className="p-1 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
                
//                 <div className="space-y-3 md:space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Activity: <span className="text-blue-600">{selectedActivityForSub}</span>
//                     </label>
//                   </div>

//                   <input
//                     type="text"
//                     placeholder="Sub-activity name"
//                     value={newSubActivity.name}
//                     onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})}
//                     className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
//                     required
//                   />
                  
//                   <select
//                     value={newSubActivity.unit}
//                     onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
//                     className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
//                   >
//                     <option value="Km">Kilometer (Km)</option>
//                     <option value="Nos.">Numbers (Nos.)</option>
//                     <option value="Percentage">Percentage (%)</option>
//                     <option value="status">Status Based</option>
//                   </select>
//                 </div>
                
//                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => closeModal(setShowAddSubActivityModal)}
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
//                   >
//                     Add Sub-Activity
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header with Mobile Step Indicator */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             Create New Project
//           </h2>
//           <p className="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1">
//             <AlertCircle size={14} />
//             Fields marked with * are required
//           </p>
//         </div>

//         {/* Mobile Step Indicator */}
//         {isMobile && (
//           <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//             <motion.div 
//               className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
//               initial={{ width: "33.33%" }}
//               animate={{ width: `${(currentStep / 3) * 100}%` }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>
//         )}
//       </div>

//       {/* ================= FORM SECTION ================= */}
//       <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
//         {/* Step 1: Basic Information */}
//         <motion.div
//           initial={false}
//           animate={{ 
//             display: !isMobile || currentStep === 1 ? "block" : "none",
//             opacity: !isMobile || currentStep === 1 ? 1 : 0
//           }}
//           className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
//         >
//           <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
//             <div className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></div>
//             <span>Basic Information</span>
//             {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 1/3</span>}
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//             {[
//               { label: "Project Code *", name: "code", icon: <Hash size={18} />, type: "text" },
//               { label: "Project Name *", name: "name", icon: <Briefcase size={18} />, type: "text" },
//               { label: "Short Name *", name: "shortName", icon: <span className="text-lg">🔤</span>, type: "text" },
//               { label: "Location", name: "location", icon: <MapPin size={18} />, type: "text" },
//             ].map((field) => (
//               <div key={field.name} className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   {field.icon}
//                 </div>
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   placeholder={field.label}
//                   value={form[field.name]}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
//                 />
//               </div>
//             ))}

//             {/* Company Selection */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Building2 size={18} />
//               </div>
//               <select
//                 name="company"
//                 className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
//                 onChange={handleChange}
//                 value={form.company}
//               >
//                 <option value="">Select Company *</option>
//                 {companies.map((c) => (
//                   <option key={c.name} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sub Company */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Building2 size={18} />
//               </div>
//               <select
//                 name="subCompany"
//                 className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
//                 onChange={handleChange}
//                 value={form.subCompany}
//               >
//                 <option value="">Select Sub Company</option>
//                 {companies.map((c) => (
//                   <option key={c.name} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sector with Add */}
//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   <Briefcase size={18} />
//                 </div>
//                 <select
//                   name="sector"
//                   className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
//                   onChange={handleChange}
//                   value={form.sector}
//                 >
//                   <option value="">Select Sector</option>
//                   {sectors.map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (newSector && !sectors.includes(newSector)) {
//                     setSectors([...sectors, newSector]);
//                     setNewSector("");
//                   }
//                 }}
//                 className="bg-blue-600 text-white px-3 md:px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
//                 title="Add new sector"
//               >
//                 <Plus size={16} />
//               </button>
//             </div>

//             <input
//               type="text"
//               placeholder="Add New Sector"
//               value={newSector}
//               onChange={(e) => setNewSector(e.target.value)}
//               className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//             />

//             {/* Client with Search */}
//             <div className="relative" ref={clientDropdownRef}>
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Users size={18} />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search Client"
//                 value={clientSearch}
//                 onClick={() => setShowClientDropdown(true)}
//                 onChange={(e) => {
//                   setClientSearch(e.target.value);
//                   setShowClientDropdown(true);
//                 }}
//                 className="w-full pl-10 pr-10 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
//               <AnimatePresence>
//                 {showClientDropdown && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
//                   >
//                     {filteredClients.length > 0 ? (
//                       filteredClients.map((client) => (
//                         <div
//                           key={client}
//                           onClick={() => {
//                             setForm({...form, department: client});
//                             setClientSearch(client);
//                             setShowClientDropdown(false);
//                           }}
//                           className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//                         >
//                           {client}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="px-3 py-2 text-gray-400 text-sm">No clients found</div>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <input
//               type="text"
//               placeholder="Add New Client"
//               value={newClient}
//               onChange={(e) => setNewClient(e.target.value)}
//               className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//             />
//           </div>

//           {/* Mobile Navigation Buttons */}
//           {isMobile && (
//             <div className="flex justify-end mt-6">
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 Next: Project Details
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {/* Step 2: Project Specifications & Dates */}
//         <motion.div
//           initial={false}
//           animate={{ 
//             display: !isMobile || currentStep === 2 ? "block" : "none",
//             opacity: !isMobile || currentStep === 2 ? 1 : 0
//           }}
//           className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
//         >
//           <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
//             <div className="w-1 h-5 md:h-6 bg-green-600 rounded-full"></div>
//             <span>Project Specifications & Dates</span>
//             {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 2/3</span>}
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//             {/* Total Length */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Ruler size={18} />
//               </div>
//               <input
//                 type="number"
//                 name="totalLength"
//                 step="0.01"
//                 placeholder="Total Length *"
//                 value={form.totalLength}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-16 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">km</span>
//             </div>

//             {/* Cost */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <IndianRupee size={18} />
//               </div>
//               <input
//                 type="number"
//                 name="cost"
//                 placeholder="Workorder Cost"
//                 value={form.cost}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-16 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">Lakhs</span>
//             </div>

//             {/* Dates in correct order */}
//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> Director Proposal Date *
//               </label>
//               <input
//                 type="date"
//                 name="directorProposalDate"
//                 value={form.directorProposalDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> Project Confirmation Date *
//               </label>
//               <input
//                 type="date"
//                 name="projectConfirmationDate"
//                 value={form.projectConfirmationDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> LOA Date *
//               </label>
//               <input
//                 type="date"
//                 name="loaDate"
//                 value={form.loaDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> Project Completion/Deadline Date *
//               </label>
//               <input
//                 type="date"
//                 name="completionDate"
//                 value={form.completionDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>
//           </div>

//           {/* Mobile Navigation Buttons */}
//           {isMobile && (
//             <div className="flex justify-between mt-6">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 <ChevronLeft size={16} />
//                 Previous
//               </button>
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 Next: Activities
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {/* Step 3: Activities */}
//         <motion.div
//           initial={false}
//           animate={{ 
//             display: !isMobile || currentStep === 3 ? "block" : "none",
//             opacity: !isMobile || currentStep === 3 ? 1 : 0
//           }}
//           className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
//         >
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
//             <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
//               <CheckCircle size={20} className="text-blue-600" />
//               <span>Select Project Activities</span>
//               <span className="text-xs md:text-sm font-normal text-gray-500 ml-2">
//                 ({selectedActivities.length} selected)
//               </span>
//               {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 3/3</span>}
//             </h3>
            
//             <button
//               type="button"
//               onClick={() => setShowAddActivityModal(true)}
//               className="w-full sm:w-auto bg-green-600 text-white px-3 md:px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
//             >
//               <Plus size={16} />
//               Add New Activity
//             </button>
//           </div>

//           {/* Activity Weightage Summary */}
//           {selectedActivities.length > 0 && (
//             <div className="mb-4 p-3 bg-blue-50 rounded-xl">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-blue-700">Total Weightage:</span>
//                 <span className={`text-lg font-bold ${Math.abs(totalWeightage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
//                   {totalWeightage}% / 100%
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Activity Selection Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
//             {getAllActivities().map((activity) => {
//               const isSelected = selectedActivities.includes(activity.name);
//               const isCustom = activity.isCustom;
              
//               return (
//                 <div key={activity.name} className="relative group">
//                   <motion.div
//                     whileHover={{ scale: 1.01 }}
//                     whileTap={{ scale: 0.99 }}
//                     onClick={() => {
//                       if (isSelected) {
//                         setSelectedActivities(prev => prev.filter((a) => a !== activity.name));
//                         // Clean up related state
//                         const newWeightages = { ...activityWeightages };
//                         delete newWeightages[activity.name];
//                         setActivityWeightages(newWeightages);
                        
//                         const newDates = { ...activityDates };
//                         delete newDates[activity.name];
//                         setActivityDates(newDates);
                        
//                         const newSubSelections = { ...selectedSubActivities };
//                         delete newSubSelections[activity.name];
//                         setSelectedSubActivities(newSubSelections);
//                       } else {
//                         setSelectedActivities(prev => [...prev, activity.name]);
//                         // Initialize with all sub-activities selected by default
//                         const allSubs = activity.subActivities.map(sub => sub.name);
//                         setSelectedSubActivities(prev => ({
//                           ...prev,
//                           [activity.name]: allSubs
//                         }));
//                       }
//                     }}
//                     className={`cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-sm
//                       ${
//                         isSelected
//                           ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg"
//                           : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
//                       }
//                     `}
//                   >
//                     <p className="font-medium md:font-semibold text-sm md:text-base text-center line-clamp-2">
//                       {activity.name}
//                     </p>
//                     <p className={`text-xs text-center mt-1 md:mt-2 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
//                       {activity.subActivities.length} sub-activities
//                     </p>
//                     {isCustom && (
//                       <span className="absolute top-1 right-1 md:top-2 md:right-2 text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full">
//                         Custom
//                       </span>
//                     )}
//                   </motion.div>
                  
//                   {isCustom && (
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeleteActivity(activity.name);
//                       }}
//                       className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                       title="Delete activity"
//                     >
//                       <X size={12} />
//                     </button>
//                   )}
                  
//                   {isSelected && (
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedActivityForSub(activity.name);
//                         setShowAddSubActivityModal(true);
//                       }}
//                       className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 whitespace-nowrap"
//                     >
//                       <Plus size={10} />
//                       Add Sub
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Selected Activities with Configuration */}
//           <AnimatePresence>
//             {selectedActivities.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="space-y-3 md:space-y-4"
//               >
//                 <h4 className="font-semibold text-gray-700 text-sm md:text-base flex items-center gap-2">
//                   <Calendar size={16} className="text-blue-600" />
//                   Configure Activities
//                 </h4>

//                 {selectedActivities.map((actName) => {
//                   const activityObj = getAllActivities().find((a) => a.name === actName);
//                   const isExpanded = expandedActivity === actName;
//                   const isCustom = activityObj?.isCustom;
//                   const selectedSubs = selectedSubActivities[actName] || [];
                  
//                   return (
//                     <motion.div
//                       key={actName}
//                       layout
//                       className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50"
//                     >
//                       {/* Activity Header */}
//                       <div
//                         onClick={() => setExpandedActivity(isExpanded ? null : actName)}
//                         className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center gap-2 flex-1 min-w-0">
//                           <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-gray-400'}`} />
//                           <h5 className="font-medium md:font-semibold text-gray-800 text-sm md:text-base truncate">
//                             {actName}
//                           </h5>
//                           {isCustom && (
//                             <span className="text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
//                               Custom
//                             </span>
//                           )}
//                           <span className="text-[10px] md:text-xs bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
//                             {selectedSubs.length}/{activityObj?.subActivities.length || 0} selected
//                           </span>
//                         </div>
                        
//                         <div className="flex items-center gap-2 md:gap-3 ml-2">
//                           {activityDates[actName]?.startDate && activityDates[actName]?.endDate && (
//                             <div className="text-[10px] md:text-xs text-gray-500 hidden md:block">
//                               {new Date(activityDates[actName].startDate).toLocaleDateString()} → {new Date(activityDates[actName].endDate).toLocaleDateString()}
//                             </div>
//                           )}
//                           {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </div>
//                       </div>

//                       {/* Expanded Content */}
//                       <AnimatePresence>
//                         {isExpanded && (
//                           <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: "auto", opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             className="border-t border-gray-200 bg-white p-3 md:p-4"
//                           >
//                             {/* Activity Weightage */}
//                             <div className="mb-3 md:mb-4">
//                               <label className="block text-xs font-medium text-gray-600 mb-1">
//                                 Activity Weightage (% of total project) *
//                               </label>
//                               <div className="relative">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   max="100"
//                                   step="0.1"
//                                   value={activityWeightages[actName] || ''}
//                                   onChange={(e) => handleActivityWeightageChange(actName, e.target.value)}
//                                   className="w-full px-3 py-1.5 md:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-8"
//                                   placeholder="Enter weightage"
//                                 />
//                                 <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                               </div>
//                             </div>

//                             {/* Activity Dates */}
//                             <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
//                               <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">Start Date *</label>
//                                 <input
//                                   type="date"
//                                   value={activityDates[actName]?.startDate || ''}
//                                   onChange={(e) => handleActivityDateChange(actName, 'startDate', e.target.value)}
//                                   className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                               <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">End Date *</label>
//                                 <input
//                                   type="date"
//                                   value={activityDates[actName]?.endDate || ''}
//                                   onChange={(e) => handleActivityDateChange(actName, 'endDate', e.target.value)}
//                                   className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                             </div>

//                             {/* Sub-activities Selection and Configuration */}
//                             <div className="flex justify-between items-center mb-2">
//                               <h6 className="font-medium text-gray-700 text-xs md:text-sm">Sub-activities:</h6>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setSelectedActivityForSub(actName);
//                                   setShowAddSubActivityModal(true);
//                                 }}
//                                 className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
//                               >
//                                 <Plus size={12} />
//                                 Add New
//                               </button>
//                             </div>
                            
//                             <div className="space-y-2 md:space-y-3">
//                               {activityObj?.subActivities.map((sub) => {
//                                 const isSelected = selectedSubs.includes(sub.name);
//                                 const key = `${actName}_${sub.name}`;
//                                 const currentUnit = subActivityUnits[key] || sub.unit;
                                
//                                 return (
//                                   <div key={sub.name} className="bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200">
//                                     <div className="flex items-center justify-between mb-2">
//                                       <div className="flex items-center gap-2">
//                                         <input
//                                           type="checkbox"
//                                           checked={isSelected}
//                                           onChange={(e) => handleSubActivitySelection(actName, sub.name, e.target.checked)}
//                                           className="w-3 h-3 md:w-4 md:h-4 text-blue-600 rounded focus:ring-blue-500"
//                                         />
//                                         <span className="text-xs md:text-sm font-medium text-gray-700">{sub.name}</span>
//                                       </div>
//                                       {isCustom && (
//                                         <button
//                                           type="button"
//                                           onClick={() => handleDeleteSubActivity(actName, sub.name)}
//                                           className="text-red-500 hover:text-red-700"
//                                         >
//                                           <X size={12} />
//                                         </button>
//                                       )}
//                                     </div>
                                    
//                                     {isSelected && (
//                                       <div className="grid grid-cols-2 gap-2 mt-2 pl-5">
//                                         <div>
//                                           <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
//                                           <select
//                                             value={currentUnit}
//                                             onChange={(e) => handleSubActivityUnitChange(actName, sub.name, e.target.value)}
//                                             className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                           >
//                                             <option value="Km">Kilometer (Km)</option>
//                                             <option value="Nos.">Numbers (Nos.)</option>
//                                             <option value="Percentage">Percentage (%)</option>
//                                             <option value="status">Status Based</option>
//                                           </select>
//                                         </div>
                                        
//                                         {currentUnit !== "status" && (
//                                           <div>
//                                             <label className="block text-[10px] text-gray-500 mb-1">Planned Quantity</label>
//                                             <input
//                                               type="number"
//                                               min="0"
//                                               step="0.01"
//                                               value={subActivityPlannedQtys[key] || ''}
//                                               onChange={(e) => handleSubActivityPlannedQtyChange(actName, sub.name, e.target.value)}
//                                               className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                               placeholder="Enter qty"
//                                             />
//                                           </div>
//                                         )}
                                        
//                                         {currentUnit === "status" && (
//                                           <div className="col-span-2">
//                                             <div className="text-[10px] text-blue-600 bg-blue-50 p-1 rounded flex items-center gap-1">
//                                               <Info size={10} />
//                                               Status-based - no quantity needed
//                                             </div>
//                                           </div>
//                                         )}
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {selectedActivities.length === 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-6 md:py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl"
//             >
//               <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
//               <p className="text-xs md:text-sm">Select activities above</p>
//             </motion.div>
//           )}

//           {/* Mobile Navigation Buttons */}
//           {isMobile && (
//             <div className="flex justify-between mt-6">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 <ChevronLeft size={16} />
//                 Previous
//               </button>
//               <button
//                 type="submit"
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
//               >
//                 Create Project
//                 <CheckCircle size={16} />
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {/* Desktop Submit Button */}
//         {!isMobile && (
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-base md:text-xl flex items-center gap-2 md:gap-3"
//             >
//               <CheckCircle size={20} />
//               Create Project
//             </button>
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default CreateProject;







///////////////////////////////




// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { 
//   Calendar, 
//   Plus,  
//   ChevronDown, 
//   ChevronUp, 
//   FileText, 
//   CheckCircle,
//   X,
//   Trash2,
//   Info,
//   Search,
//   Building2,
//   MapPin,
//   Ruler,
//   IndianRupee,
//   Briefcase,
//   Users,
//   Hash,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
//   Percent,
//   Edit3,
//   Loader2
// } from "lucide-react";
// import {
//   fetchCompanies,
//   fetchSubCompanies,
//   fetchSectors,
//   fetchClients,
//   fetchActivities,
//   fetchSubActivities,
//   createSector,
//   createClient,
//   createProject as createProjectApi,
// } from "../api/apiSlice";
// import { showSnackbar } from "../notifications/notificationSlice";
// import { addProject } from "./projectSlice";

// // Initial master activities as fallback (will be used if API fails)
// const INITIAL_MASTER_ACTIVITIES = [
//   {
//     name: "Field Team Mobilization Advance",
//     subActivities: [{ name: "Mobilization", unit: "status" }],
//   },
//   {
//     name: "Field Activities",
//     subActivities: [
//       { name: "Topo Survey", unit: "Km" },
//       { name: "Traffic Survey and Soil Sampling", unit: "Nos." },
//       { name: "Geotech Investigations", unit: "Nos." },
//       { name: "FWD", unit: "Km" },
//     ],
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
//       { name: "PDR", unit: "status" },
//       { name: "DBR", unit: "status" },
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
//       { name: "Tunnel Design", unit: "status" },
//       { name: "Cut and Cover Design", unit: "status" },
//       { name: "Slope Protection", unit: "Km" },
//       { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "status" },
//       { name: "Miscellaneous Structure", unit: "Percentage" },
//       { name: "Approval from Proof and Safety", unit: "Percentage" },
//       { name: "Approval from Authority", unit: "Percentage" },
//     ],
//   },
// ];

// const CreateProject = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get data from Redux store
//   const { 
//     companies = [], 
//     subCompanies = [], 
//     sectors = [], 
//     clients = [], 
//     activities = [],
//     subActivities = [],
//     loading 
//   } = useSelector((state) => state.api);

//   // Form state
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
//     directorProposalDate: "",
//     projectConfirmationDate: "",
//     loaDate: "",
//     completionDate: "",
//   });

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [currentStep, setCurrentStep] = useState(1);

//   // Data states
//   const [sectorsList, setSectorsList] = useState([]);
//   const [sectorsMap, setSectorsMap] = useState({});
//   const [clientsList, setClientsList] = useState([]);
//   const [clientsMap, setClientsMap] = useState({});
//   const [masterActivities, setMasterActivities] = useState(INITIAL_MASTER_ACTIVITIES);
//   const [customActivities, setCustomActivities] = useState([]);
  
//   // Search states
//   const [clientSearch, setClientSearch] = useState("");
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const clientDropdownRef = useRef(null);
  
//   const [newSector, setNewSector] = useState("");
//   const [newClient, setNewClient] = useState("");
  
//   // Selected activities state
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [activityWeightages, setActivityWeightages] = useState({});
//   const [expandedActivity, setExpandedActivity] = useState(null);
//   const [activityDates, setActivityDates] = useState({});
  
//   // Sub-activity selection state
//   const [selectedSubActivities, setSelectedSubActivities] = useState({});
//   const [subActivityPlannedQtys, setSubActivityPlannedQtys] = useState({});
//   const [subActivityUnits, setSubActivityUnits] = useState({});
  
//   // Modal states
//   const [showAddActivityModal, setShowAddActivityModal] = useState(false);
//   const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
//   const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
//   const [newActivityName, setNewActivityName] = useState("");
//   const [newSubActivity, setNewSubActivity] = useState({
//     name: "",
//     unit: "Km"
//   });

//   // Fetch initial data on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         await Promise.all([
//           dispatch(fetchCompanies()),
//           dispatch(fetchSubCompanies()),
//           dispatch(fetchSectors()),
//           dispatch(fetchClients()),
//           dispatch(fetchActivities()),
//           dispatch(fetchSubActivities()) // ✅ Fetch sub-activities too
//         ]);
//       } catch (error) {
//         console.log("Using fallback data due to API error");
//       }
//     };

//     fetchInitialData();
//   }, [dispatch]);

//   // Update sectors list and map when data loads
//   useEffect(() => {
//     if (sectors && sectors.length > 0) {
//       const map = {};
//       sectors.forEach(sector => {
//         map[sector.name] = sector.id;
//       });
//       setSectorsMap(map);
      
//       const uniqueSectors = [...new Set(sectors.map(s => s.name))];
//       setSectorsList(uniqueSectors);
//     } else {
//       setSectorsList(["Highway", "Bridge", "Metro", "Railway", "Building"]);
//     }
//   }, [sectors]);

//   // Update clients list and map when data loads
//   useEffect(() => {
//     if (clients && clients.length > 0) {
//       const map = {};
//       clients.forEach(client => {
//         map[client.name] = client.id;
//       });
//       setClientsMap(map);
      
//       const uniqueClients = [...new Set(clients.map(c => c.name))];
//       setClientsList(uniqueClients);
//     } else {
//       setClientsList([
//         "A S Traders", "AGIPL", "Ajay Parkash", "AMAG", "Ambar Infra", 
//         "Ambay Infra", "Amit Chopra", "Apco", "Arcons", "Arnac",
//         "BCC", "BRO", "Ceigall", "DCC", "Gawar",
//         "HG Infra", "KCC", "MRG", "PNC", "RKC",
//         "Sadbhav", "SKS Infra", "VRC"
//       ]);
//     }
//   }, [clients]);

//   // ✅ FIXED: Update activities when data loads - mapping API fields correctly
//   useEffect(() => {
//     console.log("Activities from API:", activities);
//     console.log("SubActivities from API:", subActivities);
    
//     if (activities && activities.length > 0) {
//       // Format activities from API
//       const formattedActivities = activities.map(activity => {
//         // Find sub-activities that belong to this activity
//         // You'll need to know how sub-activities are linked to activities
//         // This assumes subActivities have an 'activity_id' field
//         const activitySubs = subActivities.filter(
//           sub => sub.activity_id === activity.id
//         ) || [];
        
//         return {
//           id: activity.id,
//           name: activity.activity_name || activity.name, // Handle both field names
//           subActivities: activitySubs.length > 0 
//             ? activitySubs.map(sub => ({
//                 id: sub.id,
//                 name: sub.sub_activity_name || sub.name,
//                 unit: sub.unit || "Km"
//               }))
//             : [], // If no sub-activities, use empty array
//           isCustom: false
//         };
//       });
      
//       console.log("Formatted activities:", formattedActivities);
//       setMasterActivities(formattedActivities);
//     } else {
//       console.log("Using fallback activities");
//       // Keep using INITIAL_MASTER_ACTIVITIES
//     }
//   }, [activities, subActivities]);

//   // Handle resize for responsive
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close client dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
//         setShowClientDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter clients based on search
//   const filteredClients = clientsList.filter(client =>
//     client.toLowerCase().includes(clientSearch.toLowerCase())
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleActivityDateChange = (activityName, field, value) => {
//     setActivityDates(prev => ({
//       ...prev,
//       [activityName]: {
//         ...prev[activityName],
//         [field]: value
//       }
//     }));
//   };

//   const handleActivityWeightageChange = (activityName, value) => {
//     const numValue = parseFloat(value) || 0;
//     setActivityWeightages(prev => ({
//       ...prev,
//       [activityName]: numValue
//     }));
//   };

//   const handleSubActivitySelection = (activityName, subActivityName, checked) => {
//     setSelectedSubActivities(prev => {
//       const activitySubs = prev[activityName] || [];
//       if (checked) {
//         return {
//           ...prev,
//           [activityName]: [...activitySubs, subActivityName]
//         };
//       } else {
//         return {
//           ...prev,
//           [activityName]: activitySubs.filter(name => name !== subActivityName)
//         };
//       }
//     });
//   };

//   const handleSubActivityUnitChange = (activityName, subActivityName, unit) => {
//     setSubActivityUnits(prev => ({
//       ...prev,
//       [`${activityName}_${subActivityName}`]: unit
//     }));
//   };

//   const handleSubActivityPlannedQtyChange = (activityName, subActivityName, value) => {
//     const numValue = parseFloat(value) || 0;
//     setSubActivityPlannedQtys(prev => ({
//       ...prev,
//       [`${activityName}_${subActivityName}`]: numValue
//     }));
//   };

//   const handleAddActivity = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!newActivityName.trim()) {
//       dispatch(showSnackbar({
//         message: "Please enter activity name",
//         type: "error"
//       }));
//       return;
//     }

//     const newActivity = {
//       name: newActivityName,
//       subActivities: [],
//       isCustom: true
//     };

//     setCustomActivities(prev => [...prev, newActivity]);
//     setNewActivityName("");
//     setShowAddActivityModal(false);
    
//     dispatch(showSnackbar({
//       message: "Activity added successfully",
//       type: "success"
//     }));
//   };

//   const handleAddSubActivity = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!newSubActivity.name.trim()) {
//       dispatch(showSnackbar({
//         message: "Please enter sub-activity name",
//         type: "error"
//       }));
//       return;
//     }

//     const newSub = { 
//       name: newSubActivity.name, 
//       unit: newSubActivity.unit
//     };

//     // Check if it's a master activity or custom activity
//     const masterIndex = masterActivities.findIndex(act => act.name === selectedActivityForSub);
    
//     if (masterIndex !== -1) {
//       setMasterActivities(prev => prev.map((act, index) => {
//         if (index === masterIndex) {
//           return {
//             ...act,
//             subActivities: [...act.subActivities, newSub]
//           };
//         }
//         return act;
//       }));
//     } else {
//       setCustomActivities(prev => prev.map(act => {
//         if (act.name === selectedActivityForSub) {
//           return {
//             ...act,
//             subActivities: [...act.subActivities, newSub]
//           };
//         }
//         return act;
//       }));
//     }

//     setNewSubActivity({ name: "", unit: "Km" });
//     setShowAddSubActivityModal(false);
//     setSelectedActivityForSub(null);
    
//     dispatch(showSnackbar({
//       message: "Sub-activity added successfully",
//       type: "success"
//     }));
//   };

//   const handleDeleteActivity = (activityName) => {
//     if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
//       setCustomActivities(prev => prev.filter(a => a.name !== activityName));
//       setSelectedActivities(prev => prev.filter(a => a !== activityName));
      
//       // Clean up related state
//       const newWeightages = { ...activityWeightages };
//       delete newWeightages[activityName];
//       setActivityWeightages(newWeightages);
      
//       const newDates = { ...activityDates };
//       delete newDates[activityName];
//       setActivityDates(newDates);
      
//       const newSubSelections = { ...selectedSubActivities };
//       delete newSubSelections[activityName];
//       setSelectedSubActivities(newSubSelections);
      
//       dispatch(showSnackbar({
//         message: "Activity deleted successfully",
//         type: "success"
//       }));
//     }
//   };

//   const handleDeleteSubActivity = (activityName, subActivityName) => {
//     if (window.confirm(`Are you sure you want to delete sub-activity "${subActivityName}"?`)) {
      
//       const masterIndex = masterActivities.findIndex(act => act.name === activityName);
      
//       if (masterIndex !== -1) {
//         setMasterActivities(prev => prev.map(act => {
//           if (act.name === activityName) {
//             return {
//               ...act,
//               subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
//             };
//           }
//           return act;
//         }));
//       } else {
//         setCustomActivities(prev => prev.map(act => {
//           if (act.name === activityName) {
//             return {
//               ...act,
//               subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
//             };
//           }
//           return act;
//         }));
//       }

//       // Clean up related state
//       const key = `${activityName}_${subActivityName}`;
//       const newUnits = { ...subActivityUnits };
//       delete newUnits[key];
//       setSubActivityUnits(newUnits);
      
//       const newQtys = { ...subActivityPlannedQtys };
//       delete newQtys[key];
//       setSubActivityPlannedQtys(newQtys);
      
//       if (selectedSubActivities[activityName]) {
//         setSelectedSubActivities(prev => ({
//           ...prev,
//           [activityName]: prev[activityName].filter(name => name !== subActivityName)
//         }));
//       }
      
//       dispatch(showSnackbar({
//         message: "Sub-activity deleted successfully",
//         type: "success"
//       }));
//     }
//   };

//   const getAllActivities = () => {
//     return [...masterActivities, ...customActivities];
//   };

//   const validateDates = () => {
//     const dates = [
//       { name: "Director Proposal", value: form.directorProposalDate },
//       { name: "Project Confirmation", value: form.projectConfirmationDate },
//       { name: "LOA", value: form.loaDate },
//       { name: "Completion", value: form.completionDate }
//     ];

//     for (let i = 0; i < dates.length - 1; i++) {
//       if (dates[i].value && dates[i + 1].value) {
//         if (new Date(dates[i].value) > new Date(dates[i + 1].value)) {
//           dispatch(showSnackbar({
//             message: `${dates[i].name} date must be before ${dates[i + 1].name} date`,
//             type: "error"
//           }));
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const validate = () => {
//     if (!form.code || !form.name || !form.shortName) {
//       dispatch(showSnackbar({
//         message: "Please fill mandatory fields: Project Code, Name, and Short Name",
//         type: "error"
//       }));
//       return false;
//     }
//     if (!form.company) {
//       dispatch(showSnackbar({
//         message: "Please select a Company",
//         type: "error"
//       }));
//       return false;
//     }
//     if (!form.totalLength || form.totalLength <= 0) {
//       dispatch(showSnackbar({
//         message: "Please enter a valid Total Length",
//         type: "error"
//       }));
//       return false;
//     }
//     if (selectedActivities.length === 0) {
//       dispatch(showSnackbar({
//         message: "Please select at least one activity",
//         type: "error"
//       }));
//       return false;
//     }

//     const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);
//     if (Math.abs(totalWeightage - 100) > 0.01) {
//       dispatch(showSnackbar({
//         message: `Total activity weightage must sum to 100%. Current total: ${totalWeightage}%`,
//         type: "error"
//       }));
//       return false;
//     }

//     for (const activityName of selectedActivities) {
//       const dates = activityDates[activityName];
//       if (!dates?.startDate || !dates?.endDate) {
//         dispatch(showSnackbar({
//           message: `Please set start and end dates for ${activityName}`,
//           type: "error"
//         }));
//         return false;
//       }
//       if (new Date(dates.startDate) > new Date(dates.endDate)) {
//         dispatch(showSnackbar({
//           message: `End date must be after start date for ${activityName}`,
//           type: "error"
//         }));
//         return false;
//       }
//     }

//     for (const activityName of selectedActivities) {
//       const activityObj = getAllActivities().find((a) => a.name === activityName);
//       const selectedSubs = selectedSubActivities[activityName] || [];
      
//       if (selectedSubs.length === 0) {
//         dispatch(showSnackbar({
//           message: `Please select at least one sub-activity for ${activityName}`,
//           type: "error"
//         }));
//         return false;
//       }

//       for (const subName of selectedSubs) {
//         const key = `${activityName}_${subName}`;
//         const unit = subActivityUnits[key] || activityObj.subActivities.find(s => s.name === subName)?.unit || "Km";
//         const plannedQty = subActivityPlannedQtys[key];
        
//         if (unit !== "status" && (!plannedQty || plannedQty <= 0)) {
//           dispatch(showSnackbar({
//             message: `Please enter planned quantity for ${subName} in ${activityName}`,
//             type: "error"
//           }));
//           return false;
//         }
//       }
//     }

//     if (!validateDates()) {
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!validate()) return;

//     const allActivities = getAllActivities();
    
//     const formattedActivities = selectedActivities.map((actName, actIndex) => {
//       const activityObj = allActivities.find((a) => a.name === actName);
//       const dates = activityDates[actName];
//       const weightage = activityWeightages[actName] || 0;
//       const selectedSubs = selectedSubActivities[actName] || [];

//       return {
//         name: actName,
//         weightage: weightage,
//         startDate: dates.startDate,
//         endDate: dates.endDate,
//         subActivities: selectedSubs.map((subName, subIndex) => {
//           const subObj = activityObj.subActivities.find(s => s.name === subName);
//           const key = `${actName}_${subName}`;
//           const unit = subActivityUnits[key] || subObj.unit;
//           const plannedQty = subActivityPlannedQtys[key] || 0;

//           return {
//             name: subName,
//             unit: unit,
//             plannedQty: unit !== "status" ? plannedQty : 1,
//             startDate: dates.startDate,
//             endDate: dates.endDate,
//           };
//         }),
//       };
//     });

//     const selectedCompany = companies.find(c => c.name === form.company);
//     const selectedSubCompany = subCompanies.find(c => c.name === form.subCompany);
//     const sectorId = sectorsMap[form.sector] || null;
//     const clientId = clientsMap[form.department] || null;

//     const projectData = {
//       project_code: form.code,
//       project_name: form.name,
//       short_name: form.shortName,
//       company: selectedCompany?.id || null,
//       sub_company: selectedSubCompany?.id || null,
//       sector: sectorId,
//       client: clientId,
//       location: form.location,
//       total_length: parseFloat(form.totalLength),
//       cost: parseFloat(form.cost) || 0,
//       director_proposal_date: form.directorProposalDate,
//       project_confirmation_date: form.projectConfirmationDate,
//       loa_date: form.loaDate,
//       completion_date: form.completionDate,
//       activities: formattedActivities.map(act => ({
//         name: act.name,
//         weightage: act.weightage,
//         start_date: act.startDate,
//         end_date: act.endDate,
//         sub_activities: act.subActivities.map(sub => ({
//           name: sub.name,
//           unit: sub.unit,
//           planned_qty: sub.plannedQty,
//           start_date: sub.startDate,
//           end_date: sub.endDate,
//         }))
//       })),
//     };

//     console.log("Sending project data:", JSON.stringify(projectData, null, 2));

//     try {
//       const apiResult = await dispatch(createProjectApi(projectData)).unwrap();
//       console.log("API Response:", apiResult);
      
//       dispatch(addProject({
//         ...form,
//         activities: formattedActivities.map((act, idx) => ({
//           id: `a${idx + 1}_${Date.now()}`,
//           ...act,
//           progress: 0,
//           subActivities: act.subActivities.map((sub, subIdx) => ({
//             id: `s${idx + 1}_${subIdx + 1}_${Date.now()}`,
//             ...sub,
//             completedQty: 0,
//             progress: 0,
//             status: "PENDING",
//           })),
//         })),
//       }));
      
//       dispatch(showSnackbar({
//         message: "Project created successfully!",
//         type: "success"
//       }));
      
//       navigate("/projects");
//     } catch (error) {
//       console.error("Project creation error:", error.response?.data || error.message);
      
//       dispatch(showSnackbar({
//         message: error.response?.data?.message || error.message || "Failed to create project",
//         type: "error"
//       }));
//     }
//   };

//   const closeModal = (setter) => {
//     setter(false);
//   };

//   const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
//   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

//   const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-4 py-4 md:py-6"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center">
//           <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
//             <Loader2 className="animate-spin text-blue-600" size={24} />
//             <p className="text-gray-700">Loading data...</p>
//           </div>
//         </div>
//       )}

//       {/* Add Activity Modal */}
//       <AnimatePresence>
//         {showAddActivityModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => closeModal(setShowAddActivityModal)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <form onSubmit={handleAddActivity}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg md:text-xl font-bold">Add New Activity</h3>
//                   <button 
//                     type="button"
//                     onClick={() => closeModal(setShowAddActivityModal)}
//                     className="p-1 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Enter activity name"
//                   value={newActivityName}
//                   onChange={(e) => setNewActivityName(e.target.value)}
//                   className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base mb-4"
//                   autoFocus
//                 />
//                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={() => closeModal(setShowAddActivityModal)}
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
//                   >
//                     Add Activity
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Sub-Activity Modal */}
//       <AnimatePresence>
//         {showAddSubActivityModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => closeModal(setShowAddSubActivityModal)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <form onSubmit={handleAddSubActivity}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg md:text-xl font-bold">Add Sub-Activity</h3>
//                   <button
//                     type="button"
//                     onClick={() => closeModal(setShowAddSubActivityModal)}
//                     className="p-1 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
                
//                 <div className="space-y-3 md:space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Activity: <span className="text-blue-600">{selectedActivityForSub}</span>
//                     </label>
//                   </div>

//                   <input
//                     type="text"
//                     placeholder="Sub-activity name"
//                     value={newSubActivity.name}
//                     onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})}
//                     className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
//                     required
//                   />
                  
//                   <select
//                     value={newSubActivity.unit}
//                     onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
//                     className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
//                   >
//                     <option value="Km">Kilometer (Km)</option>
//                     <option value="Nos.">Numbers (Nos.)</option>
//                     <option value="Percentage">Percentage (%)</option>
//                     <option value="status">Status Based</option>
//                   </select>
//                 </div>
                
//                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => closeModal(setShowAddSubActivityModal)}
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
//                   >
//                     Add Sub-Activity
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header with Mobile Step Indicator */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             Create New Project
//           </h2>
//           <p className="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1">
//             <AlertCircle size={14} />
//             Fields marked with * are required
//           </p>
//         </div>

//         {/* Mobile Step Indicator */}
//         {isMobile && (
//           <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//             <motion.div 
//               className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
//               initial={{ width: "33.33%" }}
//               animate={{ width: `${(currentStep / 3) * 100}%` }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>
//         )}
//       </div>

//       {/* ================= FORM SECTION ================= */}
//       <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
//         {/* Step 1: Basic Information */}
//         <motion.div
//           initial={false}
//           animate={{ 
//             display: !isMobile || currentStep === 1 ? "block" : "none",
//             opacity: !isMobile || currentStep === 1 ? 1 : 0
//           }}
//           className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
//         >
//           <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
//             <div className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></div>
//             <span>Basic Information</span>
//             {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 1/3</span>}
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//             {[
//               { label: "Project Code *", name: "code", icon: <Hash size={18} />, type: "text" },
//               { label: "Project Name *", name: "name", icon: <Briefcase size={18} />, type: "text" },
//               { label: "Short Name *", name: "shortName", icon: <span className="text-lg">🔤</span>, type: "text" },
//               { label: "Location", name: "location", icon: <MapPin size={18} />, type: "text" },
//             ].map((field) => (
//               <div key={field.name} className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   {field.icon}
//                 </div>
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   placeholder={field.label}
//                   value={form[field.name]}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
//                 />
//               </div>
//             ))}

//             {/* Company Selection */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Building2 size={18} />
//               </div>
//               <select
//                 name="company"
//                 className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
//                 onChange={handleChange}
//                 value={form.company}
//               >
//                 <option value="">Select Company *</option>
//                 {companies.map((company) => (
//                   <option key={company.id} value={company.name}>
//                     {company.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sub Company */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Building2 size={18} />
//               </div>
//               <select
//                 name="subCompany"
//                 className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
//                 onChange={handleChange}
//                 value={form.subCompany}
//               >
//                 <option value="">Select Sub Company</option>
//                 {subCompanies.map((subCompany) => (
//                   <option key={subCompany.id} value={subCompany.name}>
//                     {subCompany.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sector with Add */}
//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   <Briefcase size={18} />
//                 </div>
//                 <select
//                   name="sector"
//                   className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
//                   onChange={handleChange}
//                   value={form.sector}
//                 >
//                   <option value="">Select Sector</option>
//                   {sectorsList.map((sector, index) => (
//                     <option key={`sector-${index}-${sector}`} value={sector}>
//                       {sector}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 type="button"
//                 onClick={async () => {
//                   if (newSector && !sectorsList.includes(newSector)) {
//                     try {
//                       await dispatch(createSector({ name: newSector })).unwrap();
//                       setSectorsList([...sectorsList, newSector]);
//                       setNewSector("");
//                       dispatch(showSnackbar({
//                         message: "Sector added successfully",
//                         type: "success"
//                       }));
//                     } catch (error) {
//                       setSectorsList([...sectorsList, newSector]);
//                       setNewSector("");
//                       dispatch(showSnackbar({
//                         message: "Sector added locally",
//                         type: "success"
//                       }));
//                     }
//                   }
//                 }}
//                 className="bg-blue-600 text-white px-3 md:px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
//                 title="Add new sector"
//               >
//                 <Plus size={16} />
//               </button>
//             </div>

//             <input
//               type="text"
//               placeholder="Add New Sector"
//               value={newSector}
//               onChange={(e) => setNewSector(e.target.value)}
//               className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//             />

//             {/* Client with Search */}
//             <div className="relative" ref={clientDropdownRef}>
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Users size={18} />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search Client"
//                 value={clientSearch}
//                 onClick={() => setShowClientDropdown(true)}
//                 onChange={(e) => {
//                   setClientSearch(e.target.value);
//                   setShowClientDropdown(true);
//                 }}
//                 className="w-full pl-10 pr-10 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
//               <AnimatePresence>
//                 {showClientDropdown && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
//                   >
//                     {filteredClients.length > 0 ? (
//                       filteredClients.map((client, index) => (
//                         <div
//                           key={`client-${index}-${client}`}
//                           onClick={() => {
//                             setForm({...form, department: client});
//                             setClientSearch(client);
//                             setShowClientDropdown(false);
//                           }}
//                           className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//                         >
//                           {client}
//                         </div>
//                       ))
//                     ) : (
//                       <div className="px-3 py-2 text-gray-400 text-sm">No clients found</div>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Add New Client */}
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Add New Client"
//                 value={newClient}
//                 onChange={(e) => setNewClient(e.target.value)}
//                 className="flex-1 px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <button
//                 type="button"
//                 onClick={async () => {
//                   if (newClient && !clientsList.includes(newClient)) {
//                     try {
//                       await dispatch(createClient({ name: newClient })).unwrap();
//                       setClientsList([...clientsList, newClient]);
//                       setNewClient("");
//                       dispatch(showSnackbar({
//                         message: "Client added successfully",
//                         type: "success"
//                       }));
//                     } catch (error) {
//                       setClientsList([...clientsList, newClient]);
//                       setNewClient("");
//                       dispatch(showSnackbar({
//                         message: "Client added locally",
//                         type: "success"
//                       }));
//                     }
//                   }
//                 }}
//                 className="bg-blue-600 text-white px-3 md:px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
//                 title="Add new client"
//               >
//                 <Plus size={16} />
//               </button>
//             </div>
//           </div>

//           {/* Mobile Navigation Buttons */}
//           {isMobile && (
//             <div className="flex justify-end mt-6">
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 Next: Project Details
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {/* Step 2: Project Specifications & Dates */}
//         <motion.div
//           initial={false}
//           animate={{ 
//             display: !isMobile || currentStep === 2 ? "block" : "none",
//             opacity: !isMobile || currentStep === 2 ? 1 : 0
//           }}
//           className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
//         >
//           <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
//             <div className="w-1 h-5 md:h-6 bg-green-600 rounded-full"></div>
//             <span>Project Specifications & Dates</span>
//             {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 2/3</span>}
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//             {/* Total Length */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Ruler size={18} />
//               </div>
//               <input
//                 type="number"
//                 name="totalLength"
//                 step="0.01"
//                 placeholder="Total Length *"
//                 value={form.totalLength}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-16 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">km</span>
//             </div>

//             {/* Cost */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <IndianRupee size={18} />
//               </div>
//               <input
//                 type="number"
//                 name="cost"
//                 placeholder="Workorder Cost"
//                 value={form.cost}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-16 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//               />
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">Lakhs</span>
//             </div>

//             {/* Dates */}
//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> Director Proposal Date *
//               </label>
//               <input
//                 type="date"
//                 name="directorProposalDate"
//                 value={form.directorProposalDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> Project Confirmation Date *
//               </label>
//               <input
//                 type="date"
//                 name="projectConfirmationDate"
//                 value={form.projectConfirmationDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> LOA Date *
//               </label>
//               <input
//                 type="date"
//                 name="loaDate"
//                 value={form.loaDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
//                 <Calendar size={12} /> Project Completion/Deadline Date *
//               </label>
//               <input
//                 type="date"
//                 name="completionDate"
//                 value={form.completionDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
//                 required
//               />
//             </div>
//           </div>

//           {/* Mobile Navigation Buttons */}
//           {isMobile && (
//             <div className="flex justify-between mt-6">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 <ChevronLeft size={16} />
//                 Previous
//               </button>
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 Next: Activities
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {/* Step 3: Activities */}
//         <motion.div
//           initial={false}
//           animate={{ 
//             display: !isMobile || currentStep === 3 ? "block" : "none",
//             opacity: !isMobile || currentStep === 3 ? 1 : 0
//           }}
//           className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
//         >
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
//             <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
//               <CheckCircle size={20} className="text-blue-600" />
//               <span>Select Project Activities</span>
//               <span className="text-xs md:text-sm font-normal text-gray-500 ml-2">
//                 ({selectedActivities.length} selected)
//               </span>
//               {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 3/3</span>}
//             </h3>
            
//             <button
//               type="button"
//               onClick={() => setShowAddActivityModal(true)}
//               className="w-full sm:w-auto bg-green-600 text-white px-3 md:px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
//             >
//               <Plus size={16} />
//               Add New Activity
//             </button>
//           </div>

//           {/* Activity Weightage Summary */}
//           {selectedActivities.length > 0 && (
//             <div className="mb-4 p-3 bg-blue-50 rounded-xl">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-blue-700">Total Weightage:</span>
//                 <span className={`text-lg font-bold ${Math.abs(totalWeightage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
//                   {totalWeightage}% / 100%
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Activity Selection Grid */}
//           {loading ? (
//             <div className="text-center py-8">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
//               <p className="mt-2 text-gray-500">Loading activities...</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
//               {getAllActivities().map((activity, index) => {
//                 const isSelected = selectedActivities.includes(activity.name);
//                 const isCustom = activity.isCustom;
//                 const uniqueKey = `activity-${index}-${activity.name}`;
                
//                 return (
//                   <div key={uniqueKey} className="relative group">
//                     <motion.div
//                       whileHover={{ scale: 1.01 }}
//                       whileTap={{ scale: 0.99 }}
//                       onClick={() => {
//                         if (isSelected) {
//                           setSelectedActivities(prev => prev.filter((a) => a !== activity.name));
//                           // Clean up related state
//                           const newWeightages = { ...activityWeightages };
//                           delete newWeightages[activity.name];
//                           setActivityWeightages(newWeightages);
                          
//                           const newDates = { ...activityDates };
//                           delete newDates[activity.name];
//                           setActivityDates(newDates);
                          
//                           const newSubSelections = { ...selectedSubActivities };
//                           delete newSubSelections[activity.name];
//                           setSelectedSubActivities(newSubSelections);
//                         } else {
//                           setSelectedActivities(prev => [...prev, activity.name]);
//                           // Initialize with all sub-activities selected by default
//                           const allSubs = activity.subActivities.map(sub => sub.name);
//                           setSelectedSubActivities(prev => ({
//                             ...prev,
//                             [activity.name]: allSubs
//                           }));
//                         }
//                       }}
//                       className={`cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-sm
//                         ${
//                           isSelected
//                             ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg"
//                             : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
//                         }
//                       `}
//                     >
//                       <p className="font-medium md:font-semibold text-sm md:text-base text-center line-clamp-2">
//                         {activity.name}
//                       </p>
//                       <p className={`text-xs text-center mt-1 md:mt-2 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
//                         {activity.subActivities.length} sub-activities
//                       </p>
//                       {isCustom && (
//                         <span className="absolute top-1 right-1 md:top-2 md:right-2 text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full">
//                           Custom
//                         </span>
//                       )}
//                     </motion.div>
                    
//                     {isCustom && (
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteActivity(activity.name);
//                         }}
//                         className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                         title="Delete activity"
//                       >
//                         <X size={12} />
//                       </button>
//                     )}
                    
//                     {isSelected && (
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedActivityForSub(activity.name);
//                           setShowAddSubActivityModal(true);
//                         }}
//                         className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 whitespace-nowrap"
//                       >
//                         <Plus size={10} />
//                         Add Sub
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Selected Activities with Configuration */}
//           <AnimatePresence>
//             {selectedActivities.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="space-y-3 md:space-y-4"
//               >
//                 <h4 className="font-semibold text-gray-700 text-sm md:text-base flex items-center gap-2">
//                   <Calendar size={16} className="text-blue-600" />
//                   Configure Activities
//                 </h4>

//                 {selectedActivities.map((actName) => {
//                   const activityObj = getAllActivities().find((a) => a.name === actName);
//                   const isExpanded = expandedActivity === actName;
//                   const isCustom = activityObj?.isCustom;
//                   const selectedSubs = selectedSubActivities[actName] || [];
                  
//                   return (
//                     <motion.div
//                       key={`config-${actName}`}
//                       layout
//                       className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50"
//                     >
//                       {/* Activity Header */}
//                       <div
//                         onClick={() => setExpandedActivity(isExpanded ? null : actName)}
//                         className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center gap-2 flex-1 min-w-0">
//                           <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-gray-400'}`} />
//                           <h5 className="font-medium md:font-semibold text-gray-800 text-sm md:text-base truncate">
//                             {actName}
//                           </h5>
//                           {isCustom && (
//                             <span className="text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
//                               Custom
//                             </span>
//                           )}
//                           <span className="text-[10px] md:text-xs bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
//                             {selectedSubs.length}/{activityObj?.subActivities.length || 0} selected
//                           </span>
//                         </div>
                        
//                         <div className="flex items-center gap-2 md:gap-3 ml-2">
//                           {activityDates[actName]?.startDate && activityDates[actName]?.endDate && (
//                             <div className="text-[10px] md:text-xs text-gray-500 hidden md:block">
//                               {new Date(activityDates[actName].startDate).toLocaleDateString()} → {new Date(activityDates[actName].endDate).toLocaleDateString()}
//                             </div>
//                           )}
//                           {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </div>
//                       </div>

//                       {/* Expanded Content */}
//                       <AnimatePresence>
//                         {isExpanded && (
//                           <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: "auto", opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             className="border-t border-gray-200 bg-white p-3 md:p-4"
//                           >
//                             {/* Activity Weightage */}
//                             <div className="mb-3 md:mb-4">
//                               <label className="block text-xs font-medium text-gray-600 mb-1">
//                                 Activity Weightage (% of total project) *
//                               </label>
//                               <div className="relative">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   max="100"
//                                   step="0.1"
//                                   value={activityWeightages[actName] || ''}
//                                   onChange={(e) => handleActivityWeightageChange(actName, e.target.value)}
//                                   className="w-full px-3 py-1.5 md:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-8"
//                                   placeholder="Enter weightage"
//                                 />
//                                 <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                               </div>
//                             </div>

//                             {/* Activity Dates */}
//                             <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
//                               <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">Start Date *</label>
//                                 <input
//                                   type="date"
//                                   value={activityDates[actName]?.startDate || ''}
//                                   onChange={(e) => handleActivityDateChange(actName, 'startDate', e.target.value)}
//                                   className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                               <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">End Date *</label>
//                                 <input
//                                   type="date"
//                                   value={activityDates[actName]?.endDate || ''}
//                                   onChange={(e) => handleActivityDateChange(actName, 'endDate', e.target.value)}
//                                   className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                 />
//                               </div>
//                             </div>

//                             {/* Sub-activities Selection and Configuration */}
//                             <div className="flex justify-between items-center mb-2">
//                               <h6 className="font-medium text-gray-700 text-xs md:text-sm">Sub-activities:</h6>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setSelectedActivityForSub(actName);
//                                   setShowAddSubActivityModal(true);
//                                 }}
//                                 className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
//                               >
//                                 <Plus size={12} />
//                                 Add New
//                               </button>
//                             </div>
                            
//                             <div className="space-y-2 md:space-y-3">
//                               {activityObj?.subActivities.map((sub, subIndex) => {
//                                 const isSelected = selectedSubs.includes(sub.name);
//                                 const key = `${actName}_${sub.name}`;
//                                 const currentUnit = subActivityUnits[key] || sub.unit;
//                                 const subUniqueKey = `sub-${actName}-${subIndex}-${sub.name}`;
                                
//                                 return (
//                                   <div key={subUniqueKey} className="bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200">
//                                     <div className="flex items-center justify-between mb-2">
//                                       <div className="flex items-center gap-2">
//                                         <input
//                                           type="checkbox"
//                                           checked={isSelected}
//                                           onChange={(e) => handleSubActivitySelection(actName, sub.name, e.target.checked)}
//                                           className="w-3 h-3 md:w-4 md:h-4 text-blue-600 rounded focus:ring-blue-500"
//                                         />
//                                         <span className="text-xs md:text-sm font-medium text-gray-700">{sub.name}</span>
//                                       </div>
//                                       {isCustom && (
//                                         <button
//                                           type="button"
//                                           onClick={() => handleDeleteSubActivity(actName, sub.name)}
//                                           className="text-red-500 hover:text-red-700"
//                                         >
//                                           <X size={12} />
//                                         </button>
//                                       )}
//                                     </div>
                                    
//                                     {isSelected && (
//                                       <div className="grid grid-cols-2 gap-2 mt-2 pl-5">
//                                         <div>
//                                           <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
//                                           <select
//                                             value={currentUnit}
//                                             onChange={(e) => handleSubActivityUnitChange(actName, sub.name, e.target.value)}
//                                             className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                           >
//                                             <option value="Km">Kilometer (Km)</option>
//                                             <option value="Nos.">Numbers (Nos.)</option>
//                                             <option value="Percentage">Percentage (%)</option>
//                                             <option value="status">Status Based</option>
//                                           </select>
//                                         </div>
                                        
//                                         {currentUnit !== "status" && (
//                                           <div>
//                                             <label className="block text-[10px] text-gray-500 mb-1">Planned Quantity</label>
//                                             <input
//                                               type="number"
//                                               min="0"
//                                               step="0.01"
//                                               value={subActivityPlannedQtys[key] || ''}
//                                               onChange={(e) => handleSubActivityPlannedQtyChange(actName, sub.name, e.target.value)}
//                                               className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                               placeholder="Enter qty"
//                                             />
//                                           </div>
//                                         )}
                                        
//                                         {currentUnit === "status" && (
//                                           <div className="col-span-2">
//                                             <div className="text-[10px] text-blue-600 bg-blue-50 p-1 rounded flex items-center gap-1">
//                                               <Info size={10} />
//                                               Status-based - no quantity needed
//                                             </div>
//                                           </div>
//                                         )}
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {selectedActivities.length === 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-6 md:py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl"
//             >
//               <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
//               <p className="text-xs md:text-sm">Select activities above</p>
//             </motion.div>
//           )}

//           {/* Mobile Navigation Buttons */}
//           {isMobile && (
//             <div className="flex justify-between mt-6">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
//               >
//                 <ChevronLeft size={16} />
//                 Previous
//               </button>
//               <button
//                 type="submit"
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
//               >
//                 Create Project
//                 <CheckCircle size={16} />
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {/* Desktop Submit Button */}
//         {!isMobile && (
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-base md:text-xl flex items-center gap-2 md:gap-3"
//             >
//               <CheckCircle size={20} />
//               Create Project
//             </button>
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default CreateProject;




///////////////




import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Plus,  
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CheckCircle,
  X,
  Trash2,
  Info,
  Search,
  Building2,
  MapPin,
  Ruler,
  IndianRupee,
  Briefcase,
  Users,
  Hash,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Percent,
  Edit3,
  Loader2
} from "lucide-react";
import {
  fetchCompanies,
  fetchSubCompanies,
  fetchSectors,
  fetchClients,
  fetchActivities,
  fetchSubActivities,
  createSector,
  createClient,
  createProject as createProjectApi,
} from "../api/apiSlice";
import { showSnackbar } from "../notifications/notificationSlice";
import { addProject } from "./projectSlice";

// ==================== CONSTANTS ====================
// Pre-defined master activities that will ALWAYS show in the UI
const MASTER_ACTIVITIES = [
  {
    id: "master-1",
    name: "Field Team Mobilization Advance",
    subActivities: [
      { id: "master-s1", name: "Mobilization", unit: "status" }
    ],
    isPredefined: true
  },
  {
    id: "master-2",
    name: "Field Activities",
    subActivities: [
      { id: "master-s2-1", name: "Topo Survey", unit: "Km" },
      { id: "master-s2-2", name: "Traffic Survey and Soil Sampling", unit: "Nos." },
      { id: "master-s2-3", name: "Geotech Investigations", unit: "Nos." },
      { id: "master-s2-4", name: "FWD", unit: "Km" },
    ],
    isPredefined: true
  },
  {
    id: "master-3",
    name: "Design Scope",
    subActivities: [
      { name: "TCS", unit: "Nos." },
      { name: "MCW", unit: "Km" },
      { name: "Cross Road", unit: "Nos." },
      { name: "Service Road", unit: "Km" },
      { name: "Slip Road", unit: "Km" },
      { name: "Interchange", unit: "Km" },
      { name: "PDR", unit: "status" },
      { name: "DBR", unit: "status" },
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
      { name: "Tunnel Design", unit: "status" },
      { name: "Cut and Cover Design", unit: "status" },
      { name: "Slope Protection", unit: "Km" },
      { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "status" },
      { name: "Miscellaneous Structure", unit: "Percentage" },
      { name: "Approval from Proof and Safety", unit: "Percentage" },
      { name: "Approval from Authority", unit: "Percentage" },
    ].map((sub, index) => ({ ...sub, id: `master-s3-${index}` })),
    isPredefined: true
  },
];

// ==================== COMPONENT ====================
const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==================== REDUX STATE ====================
  const { 
    companies = [], 
    subCompanies = [], 
    sectors = [], 
    clients = [], 
    activities: apiActivities = [],
    subActivities: apiSubActivities = [],
    loading 
  } = useSelector((state) => state.api);

  // ==================== LOCAL STATE ====================
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
    directorProposalDate: "",
    projectConfirmationDate: "",
    loaDate: "",
    completionDate: "",
  });

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentStep, setCurrentStep] = useState(1);

  // Data states
  const [sectorsList, setSectorsList] = useState([]);
  const [sectorsMap, setSectorsMap] = useState({});
  const [clientsList, setClientsList] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  
  // Activities state - Initialize with MASTER_ACTIVITIES
  const [availableActivities, setAvailableActivities] = useState(MASTER_ACTIVITIES);
  const [customActivities, setCustomActivities] = useState([]);
  
  // Search states
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientDropdownRef = useRef(null);
  
  const [newSector, setNewSector] = useState("");
  const [newClient, setNewClient] = useState("");
  
  // Selected activities state
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activityWeightages, setActivityWeightages] = useState({});
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [activityDates, setActivityDates] = useState({});
  
  // Sub-activity selection state
  const [selectedSubActivities, setSelectedSubActivities] = useState({});
  const [subActivityPlannedQtys, setSubActivityPlannedQtys] = useState({});
  const [subActivityUnits, setSubActivityUnits] = useState({});
  
  // Modal states
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
  const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
  const [newActivityName, setNewActivityName] = useState("");
  const [newSubActivity, setNewSubActivity] = useState({
    name: "",
    unit: "Km"
  });

  // ==================== MEMOIZED VALUES ====================
  const allActivities = useMemo(() => {
    return [...availableActivities, ...customActivities];
  }, [availableActivities, customActivities]);

  const totalWeightage = useMemo(() => {
    return Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);
  }, [activityWeightages]);

  const filteredClients = useMemo(() => {
    return clientsList.filter(client =>
      client.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientsList, clientSearch]);

  // ==================== EFFECTS ====================
  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.allSettled([
          dispatch(fetchCompanies()),
          dispatch(fetchSubCompanies()),
          dispatch(fetchSectors()),
          dispatch(fetchClients()),
          dispatch(fetchActivities()),
          dispatch(fetchSubActivities())
        ]);
      } catch (error) {
        console.log("Some API calls failed, using fallback data");
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Merge API activities with master activities
  useEffect(() => {
    if (apiActivities.length > 0) {
      // Transform API activities to match our format
      const apiActivitiesFormatted = apiActivities.map(activity => {
        // Find related sub-activities from API
        const activitySubs = apiSubActivities.filter(
          sub => sub.activity === activity.id || sub.activity_id === activity.id
        ).map(sub => ({
          id: sub.id,
          name: sub.sub_activity_name || sub.name,
          unit: sub.unit || "Km",
          fromApi: true
        }));

        return {
          id: activity.id,
          name: activity.activity_name || activity.name,
          subActivities: activitySubs.length > 0 ? activitySubs : [],
          isPredefined: false,
          fromApi: true
        };
      });

      // Merge with master activities, avoiding duplicates by name
      const mergedActivities = [...MASTER_ACTIVITIES];
      
      apiActivitiesFormatted.forEach(apiActivity => {
        const exists = mergedActivities.some(a => a.name === apiActivity.name);
        if (!exists) {
          mergedActivities.push(apiActivity);
        }
      });

      setAvailableActivities(mergedActivities);
    }
  }, [apiActivities, apiSubActivities]);

  // Update sectors list and map
  useEffect(() => {
    if (sectors.length > 0) {
      const map = {};
      const list = [];
      sectors.forEach(sector => {
        map[sector.name] = sector.id;
        list.push(sector.name);
      });
      setSectorsMap(map);
      setSectorsList([...new Set(list)]);
    }
  }, [sectors]);

  // Update clients list and map
  useEffect(() => {
    if (clients.length > 0) {
      const map = {};
      const list = [];
      clients.forEach(client => {
        map[client.name] = client.id;
        list.push(client.name);
      });
      setClientsMap(map);
      setClientsList([...new Set(list)]);
    }
  }, [clients]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close client dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==================== HANDLERS ====================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleActivityDateChange = useCallback((activityName, field, value) => {
    setActivityDates(prev => ({
      ...prev,
      [activityName]: {
        ...prev[activityName],
        [field]: value
      }
    }));
  }, []);

  const handleActivityWeightageChange = useCallback((activityName, value) => {
    const numValue = parseFloat(value) || 0;
    setActivityWeightages(prev => ({
      ...prev,
      [activityName]: numValue
    }));
  }, []);

  const handleSubActivitySelection = useCallback((activityName, subActivityName, checked) => {
    setSelectedSubActivities(prev => {
      const activitySubs = prev[activityName] || [];
      if (checked) {
        return {
          ...prev,
          [activityName]: [...activitySubs, subActivityName]
        };
      } else {
        return {
          ...prev,
          [activityName]: activitySubs.filter(name => name !== subActivityName)
        };
      }
    });
  }, []);

  const handleSubActivityUnitChange = useCallback((activityName, subActivityName, unit) => {
    setSubActivityUnits(prev => ({
      ...prev,
      [`${activityName}_${subActivityName}`]: unit
    }));
  }, []);

  const handleSubActivityPlannedQtyChange = useCallback((activityName, subActivityName, value) => {
    const numValue = parseFloat(value) || 0;
    setSubActivityPlannedQtys(prev => ({
      ...prev,
      [`${activityName}_${subActivityName}`]: numValue
    }));
  }, []);

  const handleAddActivity = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newActivityName.trim()) {
      dispatch(showSnackbar({
        message: "Please enter activity name",
        type: "error"
      }));
      return;
    }

    const newActivity = {
      id: `custom-${Date.now()}`,
      name: newActivityName,
      subActivities: [],
      isCustom: true
    };

    setCustomActivities(prev => [...prev, newActivity]);
    setNewActivityName("");
    setShowAddActivityModal(false);
    
    dispatch(showSnackbar({
      message: "Activity added successfully",
      type: "success"
    }));
  }, [newActivityName, dispatch]);

  const handleAddSubActivity = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newSubActivity.name.trim()) {
      dispatch(showSnackbar({
        message: "Please enter sub-activity name",
        type: "error"
      }));
      return;
    }

    const newSub = { 
      id: `sub-${Date.now()}`,
      name: newSubActivity.name, 
      unit: newSubActivity.unit
    };

    // Add to the appropriate activity
    setAvailableActivities(prev => prev.map(act => {
      if (act.name === selectedActivityForSub) {
        return {
          ...act,
          subActivities: [...act.subActivities, newSub]
        };
      }
      return act;
    }));

    setCustomActivities(prev => prev.map(act => {
      if (act.name === selectedActivityForSub) {
        return {
          ...act,
          subActivities: [...act.subActivities, newSub]
        };
      }
      return act;
    }));

    setNewSubActivity({ name: "", unit: "Km" });
    setShowAddSubActivityModal(false);
    setSelectedActivityForSub(null);
    
    dispatch(showSnackbar({
      message: "Sub-activity added successfully",
      type: "success"
    }));
  }, [newSubActivity, selectedActivityForSub, dispatch]);

  const handleDeleteActivity = useCallback((activityName) => {
    if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
      setCustomActivities(prev => prev.filter(a => a.name !== activityName));
      setSelectedActivities(prev => prev.filter(a => a !== activityName));
      
      // Clean up related state
      setActivityWeightages(prev => {
        const newState = { ...prev };
        delete newState[activityName];
        return newState;
      });
      
      setActivityDates(prev => {
        const newState = { ...prev };
        delete newState[activityName];
        return newState;
      });
      
      setSelectedSubActivities(prev => {
        const newState = { ...prev };
        delete newState[activityName];
        return newState;
      });
      
      dispatch(showSnackbar({
        message: "Activity deleted successfully",
        type: "success"
      }));
    }
  }, [dispatch]);

  const handleDeleteSubActivity = useCallback((activityName, subActivityName) => {
    if (window.confirm(`Are you sure you want to delete sub-activity "${subActivityName}"?`)) {
      
      setAvailableActivities(prev => prev.map(act => {
        if (act.name === activityName) {
          return {
            ...act,
            subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
          };
        }
        return act;
      }));

      setCustomActivities(prev => prev.map(act => {
        if (act.name === activityName) {
          return {
            ...act,
            subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
          };
        }
        return act;
      }));

      // Clean up related state
      const key = `${activityName}_${subActivityName}`;
      setSubActivityUnits(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      
      setSubActivityPlannedQtys(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      
      setSelectedSubActivities(prev => {
        const activitySubs = prev[activityName] || [];
        return {
          ...prev,
          [activityName]: activitySubs.filter(name => name !== subActivityName)
        };
      });
      
      dispatch(showSnackbar({
        message: "Sub-activity deleted successfully",
        type: "success"
      }));
    }
  }, [dispatch]);

  // ==================== VALIDATION ====================
  const validateDates = useCallback(() => {
    const dates = [
      { name: "Director Proposal", value: form.directorProposalDate },
      { name: "Project Confirmation", value: form.projectConfirmationDate },
      { name: "LOA", value: form.loaDate },
      { name: "Completion", value: form.completionDate }
    ];

    for (let i = 0; i < dates.length - 1; i++) {
      if (dates[i].value && dates[i + 1].value) {
        if (new Date(dates[i].value) > new Date(dates[i + 1].value)) {
          dispatch(showSnackbar({
            message: `${dates[i].name} date must be before ${dates[i + 1].name} date`,
            type: "error"
          }));
          return false;
        }
      }
    }
    return true;
  }, [form, dispatch]);

  const validate = useCallback(() => {
    if (!form.code || !form.name || !form.shortName) {
      dispatch(showSnackbar({
        message: "Please fill mandatory fields: Project Code, Name, and Short Name",
        type: "error"
      }));
      return false;
    }
    if (!form.company) {
      dispatch(showSnackbar({
        message: "Please select a Company",
        type: "error"
      }));
      return false;
    }
    if (!form.totalLength || form.totalLength <= 0) {
      dispatch(showSnackbar({
        message: "Please enter a valid Total Length",
        type: "error"
      }));
      return false;
    }
    if (selectedActivities.length === 0) {
      dispatch(showSnackbar({
        message: "Please select at least one activity",
        type: "error"
      }));
      return false;
    }

    if (Math.abs(totalWeightage - 100) > 0.01) {
      dispatch(showSnackbar({
        message: `Total activity weightage must sum to 100%. Current total: ${totalWeightage}%`,
        type: "error"
      }));
      return false;
    }

    for (const activityName of selectedActivities) {
      const dates = activityDates[activityName];
      if (!dates?.startDate || !dates?.endDate) {
        dispatch(showSnackbar({
          message: `Please set start and end dates for ${activityName}`,
          type: "error"
        }));
        return false;
      }
      if (new Date(dates.startDate) > new Date(dates.endDate)) {
        dispatch(showSnackbar({
          message: `End date must be after start date for ${activityName}`,
          type: "error"
        }));
        return false;
      }
    }

    for (const activityName of selectedActivities) {
      const activityObj = allActivities.find((a) => a.name === activityName);
      const selectedSubs = selectedSubActivities[activityName] || [];
      
      if (selectedSubs.length === 0) {
        dispatch(showSnackbar({
          message: `Please select at least one sub-activity for ${activityName}`,
          type: "error"
        }));
        return false;
      }

      for (const subName of selectedSubs) {
        const key = `${activityName}_${subName}`;
        const unit = subActivityUnits[key] || activityObj.subActivities.find(s => s.name === subName)?.unit || "Km";
        const plannedQty = subActivityPlannedQtys[key];
        
        if (unit !== "status" && (!plannedQty || plannedQty <= 0)) {
          dispatch(showSnackbar({
            message: `Please enter planned quantity for ${subName} in ${activityName}`,
            type: "error"
          }));
          return false;
        }
      }
    }

    if (!validateDates()) {
      return false;
    }
    
    return true;
  }, [form, selectedActivities, totalWeightage, activityDates, allActivities, selectedSubActivities, subActivityUnits, subActivityPlannedQtys, validateDates, dispatch]);

  // ==================== SUBMIT ====================
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validate()) return;

    // Format activities for submission - CORRECT FIELD NAMES FOR BACKEND
    const formattedActivities = selectedActivities.map((actName) => {
      const activityObj = allActivities.find((a) => a.name === actName);
      const dates = activityDates[actName];
      const weightage = activityWeightages[actName] || 0;
      const selectedSubs = selectedSubActivities[actName] || [];

      return {
        activity_name: actName,
        weightage: weightage,
        start_date: dates.startDate,
        end_date: dates.endDate,
        sub_activities: selectedSubs.map((subName) => {
          const subObj = activityObj.subActivities.find(s => s.name === subName);
          const key = `${actName}_${subName}`;
          const unit = subActivityUnits[key] || subObj.unit;
          const plannedQty = subActivityPlannedQtys[key] || 0;

          return {
            sub_activity_name: subName,
            unit: unit,
            planned_quantity: unit !== "status" ? plannedQty : 1,
            start_date: dates.startDate,
            end_date: dates.endDate,
          };
        }),
      };
    });

    // Get IDs for foreign keys
    const selectedCompany = companies.find(c => c.name === form.company);
    const selectedSubCompany = subCompanies.find(c => c.name === form.subCompany);
    const sectorId = sectorsMap[form.sector] || null;
    const clientId = clientsMap[form.department] || null;

    // Prepare data for API - CORRECT FIELD NAMES FOR BACKEND
    const projectData = {
      project_code: form.code,
      project_name: form.name,
      short_name: form.shortName,
      company: selectedCompany?.id || null,
      sub_company: selectedSubCompany?.id || null,
      sector: sectorId,
      client: clientId,
      location: form.location,
      total_length: parseFloat(form.totalLength),
      workorder_cost: parseFloat(form.cost) || 0,
      director_proposal_date: form.directorProposalDate,
      project_confirmation_date: form.projectConfirmationDate,
      loa_date: form.loaDate,
      completion_date: form.completionDate,
      activities: formattedActivities,
    };

    console.log("Sending project data:", JSON.stringify(projectData, null, 2));

    try {
      // Send to API
      const apiResult = await dispatch(createProjectApi(projectData)).unwrap();
      console.log("API Response:", apiResult);
      
      // Also save to local Redux store for immediate UI update
      dispatch(addProject({
        ...form,
        activities: selectedActivities.map((actName, idx) => {
          const activityObj = allActivities.find((a) => a.name === actName);
          const dates = activityDates[actName];
          const selectedSubs = selectedSubActivities[actName] || [];
          
          return {
            id: `local-${idx + 1}_${Date.now()}`,
            name: actName,
            weightage: activityWeightages[actName] || 0,
            startDate: dates.startDate,
            endDate: dates.endDate,
            progress: 0,
            subActivities: selectedSubs.map((subName, subIdx) => {
              const subObj = activityObj.subActivities.find(s => s.name === subName);
              const key = `${actName}_${subName}`;
              const unit = subActivityUnits[key] || subObj.unit;
              const plannedQty = subActivityPlannedQtys[key] || 0;

              return {
                id: `local-sub-${idx + 1}_${subIdx + 1}_${Date.now()}`,
                name: subName,
                unit: unit,
                plannedQty: unit !== "status" ? plannedQty : 1,
                completedQty: 0,
                progress: 0,
                startDate: dates.startDate,
                endDate: dates.endDate,
                status: "PENDING",
              };
            }),
          };
        }),
      }));
      
      dispatch(showSnackbar({
        message: "Project created successfully!",
        type: "success"
      }));
      
      navigate("/projects");
    } catch (error) {
      console.error("Project creation error:", error.response?.data || error);
      
      // Still save locally even if API fails (offline mode)
      dispatch(addProject({
        ...form,
        activities: selectedActivities.map((actName, idx) => {
          const activityObj = allActivities.find((a) => a.name === actName);
          const dates = activityDates[actName];
          const selectedSubs = selectedSubActivities[actName] || [];
          
          return {
            id: `local-${idx + 1}_${Date.now()}`,
            name: actName,
            weightage: activityWeightages[actName] || 0,
            startDate: dates.startDate,
            endDate: dates.endDate,
            progress: 0,
            subActivities: selectedSubs.map((subName, subIdx) => {
              const subObj = activityObj.subActivities.find(s => s.name === subName);
              const key = `${actName}_${subName}`;
              const unit = subActivityUnits[key] || subObj.unit;
              const plannedQty = subActivityPlannedQtys[key] || 0;

              return {
                id: `local-sub-${idx + 1}_${subIdx + 1}_${Date.now()}`,
                name: subName,
                unit: unit,
                plannedQty: unit !== "status" ? plannedQty : 1,
                completedQty: 0,
                progress: 0,
                startDate: dates.startDate,
                endDate: dates.endDate,
                status: "PENDING",
              };
            }),
          };
        }),
      }));
      
      dispatch(showSnackbar({
        message: error.response?.data?.message || error.message || "Failed to create project on server, but saved locally",
        type: "warning"
      }));
      
      navigate("/projects");
    }
  }, [validate, allActivities, selectedActivities, activityDates, activityWeightages, selectedSubActivities, subActivityUnits, subActivityPlannedQtys, companies, subCompanies, sectorsMap, clientsMap, form, dispatch, navigate]);

  // ==================== UI HELPERS ====================
  const closeModal = useCallback((setter) => {
    setter(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // ==================== RENDER ====================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-4 py-4 md:py-6"
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <p className="text-gray-700">Loading data...</p>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => closeModal(setShowAddActivityModal)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAddActivity}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold">Add New Activity</h3>
                  <button 
                    type="button"
                    onClick={() => closeModal(setShowAddActivityModal)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter activity name"
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base mb-4"
                  autoFocus
                />
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => closeModal(setShowAddActivityModal)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
                  >
                    Add Activity
                  </button>
                </div>
              </form>
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
            onClick={() => closeModal(setShowAddSubActivityModal)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAddSubActivity}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold">Add Sub-Activity</h3>
                  <button
                    type="button"
                    onClick={() => closeModal(setShowAddSubActivityModal)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity: <span className="text-blue-600">{selectedActivityForSub}</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Sub-activity name"
                    value={newSubActivity.name}
                    onChange={(e) => setNewSubActivity({...newSubActivity, name: e.target.value})}
                    className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
                    required
                  />
                  
                  <select
                    value={newSubActivity.unit}
                    onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
                    className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
                  >
                    <option value="Km">Kilometer (Km)</option>
                    <option value="Nos.">Numbers (Nos.)</option>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="status">Status Based</option>
                  </select>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => closeModal(setShowAddSubActivityModal)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
                  >
                    Add Sub-Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Project
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            Fields marked with * are required
          </p>
        </div>

        {/* Mobile Step Indicator */}
        {isMobile && (
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ width: "33.33%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Step 1: Basic Information */}
        <motion.div
          initial={false}
          animate={{ 
            display: !isMobile || currentStep === 1 ? "block" : "none",
            opacity: !isMobile || currentStep === 1 ? 1 : 0
          }}
          className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
        >
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-1 h-5 md:h-6 bg-blue-600 rounded-full"></div>
            <span>Basic Information</span>
            {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 1/3</span>}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { label: "Project Code *", name: "code", icon: <Hash size={18} />, type: "text" },
              { label: "Project Name *", name: "name", icon: <Briefcase size={18} />, type: "text" },
              { label: "Short Name *", name: "shortName", icon: <span className="text-lg">🔤</span>, type: "text" },
              { label: "Location", name: "location", icon: <MapPin size={18} />, type: "text" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            ))}

            {/* Company Selection */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 size={18} />
              </div>
              <select
                name="company"
                className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
                onChange={handleChange}
                value={form.company}
              >
                <option value="">Select Company *</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Company */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 size={18} />
              </div>
              <select
                name="subCompany"
                className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
                onChange={handleChange}
                value={form.subCompany}
              >
                <option value="">Select Sub Company</option>
                {subCompanies.map((subCompany) => (
                  <option key={subCompany.id} value={subCompany.name}>
                    {subCompany.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector with Add */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Briefcase size={18} />
                </div>
                <select
                  name="sector"
                  className="w-full pl-10 pr-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
                  onChange={handleChange}
                  value={form.sector}
                >
                  <option value="">Select Sector</option>
                  {sectorsList.map((sector, index) => (
                    <option key={`sector-${index}-${sector}`} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (newSector && !sectorsList.includes(newSector)) {
                    try {
                      await dispatch(createSector({ name: newSector })).unwrap();
                      setSectorsList([...sectorsList, newSector]);
                      setNewSector("");
                      dispatch(showSnackbar({
                        message: "Sector added successfully",
                        type: "success"
                      }));
                    } catch (error) {
                      setSectorsList([...sectorsList, newSector]);
                      setNewSector("");
                      dispatch(showSnackbar({
                        message: "Sector added locally",
                        type: "success"
                      }));
                    }
                  }
                }}
                className="bg-blue-600 text-white px-3 md:px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                title="Add new sector"
              >
                <Plus size={16} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Add New Sector"
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
              className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />

            {/* Client with Search */}
            <div className="relative" ref={clientDropdownRef}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users size={18} />
              </div>
              <input
                type="text"
                placeholder="Search Client"
                value={clientSearch}
                onClick={() => setShowClientDropdown(true)}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowClientDropdown(true);
                }}
                className="w-full pl-10 pr-10 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              
              <AnimatePresence>
                {showClientDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                  >
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client, index) => (
                        <div
                          key={`client-${index}-${client}`}
                          onClick={() => {
                            setForm({...form, department: client});
                            setClientSearch(client);
                            setShowClientDropdown(false);
                          }}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                        >
                          {client}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-400 text-sm">No clients found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add New Client */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add New Client"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="flex-1 px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <button
                type="button"
                onClick={async () => {
                  if (newClient && !clientsList.includes(newClient)) {
                    try {
                      await dispatch(createClient({ name: newClient })).unwrap();
                      setClientsList([...clientsList, newClient]);
                      setNewClient("");
                      dispatch(showSnackbar({
                        message: "Client added successfully",
                        type: "success"
                      }));
                    } catch (error) {
                      setClientsList([...clientsList, newClient]);
                      setNewClient("");
                      dispatch(showSnackbar({
                        message: "Client added locally",
                        type: "success"
                      }));
                    }
                  }
                }}
                className="bg-blue-600 text-white px-3 md:px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                title="Add new client"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          {isMobile && (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                Next: Project Details
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Step 2: Project Specifications & Dates */}
        <motion.div
          initial={false}
          animate={{ 
            display: !isMobile || currentStep === 2 ? "block" : "none",
            opacity: !isMobile || currentStep === 2 ? 1 : 0
          }}
          className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
        >
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-1 h-5 md:h-6 bg-green-600 rounded-full"></div>
            <span>Project Specifications & Dates</span>
            {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 2/3</span>}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Total Length */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Ruler size={18} />
              </div>
              <input
                type="number"
                name="totalLength"
                step="0.01"
                placeholder="Total Length *"
                value={form.totalLength}
                onChange={handleChange}
                className="w-full pl-10 pr-16 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">km</span>
            </div>

            {/* Cost */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IndianRupee size={18} />
              </div>
              <input
                type="number"
                name="cost"
                placeholder="Workorder Cost"
                value={form.cost}
                onChange={handleChange}
                className="w-full pl-10 pr-16 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm">Lakhs</span>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> Director Proposal Date *
              </label>
              <input
                type="date"
                name="directorProposalDate"
                value={form.directorProposalDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> Project Confirmation Date *
              </label>
              <input
                type="date"
                name="projectConfirmationDate"
                value={form.projectConfirmationDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> LOA Date *
              </label>
              <input
                type="date"
                name="loaDate"
                value={form.loaDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> Project Completion/Deadline Date *
              </label>
              <input
                type="date"
                name="completionDate"
                value={form.completionDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          {isMobile && (
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                Next: Activities
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Step 3: Activities */}
        <motion.div
          initial={false}
          animate={{ 
            display: !isMobile || currentStep === 3 ? "block" : "none",
            opacity: !isMobile || currentStep === 3 ? 1 : 0
          }}
          className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-600" />
              <span>Select Project Activities</span>
              <span className="text-xs md:text-sm font-normal text-gray-500 ml-2">
                ({selectedActivities.length} selected)
              </span>
              {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 3/3</span>}
            </h3>
            
            <button
              type="button"
              onClick={() => setShowAddActivityModal(true)}
              className="w-full sm:w-auto bg-green-600 text-white px-3 md:px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add New Activity
            </button>
          </div>

          {/* Activity Weightage Summary */}
          {selectedActivities.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">Total Weightage:</span>
                <span className={`text-lg font-bold ${Math.abs(totalWeightage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalWeightage}% / 100%
                </span>
              </div>
            </div>
          )}

          {/* Activity Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            {allActivities.map((activity, index) => {
              const isSelected = selectedActivities.includes(activity.name);
              const isCustom = activity.isCustom;
              const uniqueKey = activity.id || `activity-${index}-${activity.name}`;
              
              return (
                <div key={uniqueKey} className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedActivities(prev => prev.filter((a) => a !== activity.name));
                        // Clean up related state
                        setActivityWeightages(prev => {
                          const newState = { ...prev };
                          delete newState[activity.name];
                          return newState;
                        });
                        
                        setActivityDates(prev => {
                          const newState = { ...prev };
                          delete newState[activity.name];
                          return newState;
                        });
                        
                        setSelectedSubActivities(prev => {
                          const newState = { ...prev };
                          delete newState[activity.name];
                          return newState;
                        });
                      } else {
                        setSelectedActivities(prev => [...prev, activity.name]);
                        // Initialize with all sub-activities selected by default
                        const allSubs = activity.subActivities.map(sub => sub.name);
                        setSelectedSubActivities(prev => ({
                          ...prev,
                          [activity.name]: allSubs
                        }));
                      }
                    }}
                    className={`cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-sm
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg"
                          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
                      }
                    `}
                  >
                    <p className="font-medium md:font-semibold text-sm md:text-base text-center line-clamp-2">
                      {activity.name}
                    </p>
                    <p className={`text-xs text-center mt-1 md:mt-2 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                      {activity.subActivities.length} sub-activities
                    </p>
                    {activity.isPredefined && (
                      <span className="absolute top-1 right-1 md:top-2 md:right-2 text-[10px] md:text-xs bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full">
                        Master
                      </span>
                    )}
                    {isCustom && (
                      <span className="absolute top-1 right-1 md:top-2 md:right-2 text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    )}
                  </motion.div>
                  
                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteActivity(activity.name);
                      }}
                      className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete activity"
                    >
                      <X size={12} />
                    </button>
                  )}
                  
                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedActivityForSub(activity.name);
                        setShowAddSubActivityModal(true);
                      }}
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus size={10} />
                      Add Sub
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Activities with Configuration */}
          <AnimatePresence>
            {selectedActivities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3 md:space-y-4"
              >
                <h4 className="font-semibold text-gray-700 text-sm md:text-base flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  Configure Activities
                </h4>

                {selectedActivities.map((actName) => {
                  const activityObj = allActivities.find((a) => a.name === actName);
                  const isExpanded = expandedActivity === actName;
                  const isCustom = activityObj?.isCustom;
                  const selectedSubs = selectedSubActivities[actName] || [];
                  
                  return (
                    <motion.div
                      key={`config-${actName}`}
                      layout
                      className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50"
                    >
                      {/* Activity Header */}
                      <div
                        onClick={() => setExpandedActivity(isExpanded ? null : actName)}
                        className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-gray-400'}`} />
                          <h5 className="font-medium md:font-semibold text-gray-800 text-sm md:text-base truncate">
                            {actName}
                          </h5>
                          {activityObj?.isPredefined && (
                            <span className="text-[10px] md:text-xs bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
                              Master
                            </span>
                          )}
                          {isCustom && (
                            <span className="text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
                              Custom
                            </span>
                          )}
                          <span className="text-[10px] md:text-xs bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
                            {selectedSubs.length}/{activityObj?.subActivities.length || 0} selected
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-3 ml-2">
                          {activityDates[actName]?.startDate && activityDates[actName]?.endDate && (
                            <div className="text-[10px] md:text-xs text-gray-500 hidden md:block">
                              {new Date(activityDates[actName].startDate).toLocaleDateString()} → {new Date(activityDates[actName].endDate).toLocaleDateString()}
                            </div>
                          )}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-200 bg-white p-3 md:p-4"
                          >
                            {/* Activity Weightage */}
                            <div className="mb-3 md:mb-4">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Activity Weightage (% of total project) *
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={activityWeightages[actName] || ''}
                                  onChange={(e) => handleActivityWeightageChange(actName, e.target.value)}
                                  className="w-full px-3 py-1.5 md:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-8"
                                  placeholder="Enter weightage"
                                />
                                <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>
                            </div>

                            {/* Activity Dates */}
                            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Start Date *</label>
                                <input
                                  type="date"
                                  value={activityDates[actName]?.startDate || ''}
                                  onChange={(e) => handleActivityDateChange(actName, 'startDate', e.target.value)}
                                  className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">End Date *</label>
                                <input
                                  type="date"
                                  value={activityDates[actName]?.endDate || ''}
                                  onChange={(e) => handleActivityDateChange(actName, 'endDate', e.target.value)}
                                  className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            {/* Sub-activities Selection and Configuration */}
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="font-medium text-gray-700 text-xs md:text-sm">Sub-activities:</h6>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedActivityForSub(actName);
                                  setShowAddSubActivityModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
                              >
                                <Plus size={12} />
                                Add New
                              </button>
                            </div>
                            
                            <div className="space-y-2 md:space-y-3">
                              {activityObj?.subActivities.map((sub, subIndex) => {
                                const isSelected = selectedSubs.includes(sub.name);
                                const key = `${actName}_${sub.name}`;
                                const currentUnit = subActivityUnits[key] || sub.unit;
                                const subUniqueKey = sub.id || `sub-${actName}-${subIndex}-${sub.name}`;
                                
                                return (
                                  <div key={subUniqueKey} className="bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={(e) => handleSubActivitySelection(actName, sub.name, e.target.checked)}
                                          className="w-3 h-3 md:w-4 md:h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-xs md:text-sm font-medium text-gray-700">{sub.name}</span>
                                      </div>
                                      {isCustom && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSubActivity(actName, sub.name)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <X size={12} />
                                        </button>
                                      )}
                                    </div>
                                    
                                    {isSelected && (
                                      <div className="grid grid-cols-2 gap-2 mt-2 pl-5">
                                        <div>
                                          <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
                                          <select
                                            value={currentUnit}
                                            onChange={(e) => handleSubActivityUnitChange(actName, sub.name, e.target.value)}
                                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                          >
                                            <option value="Km">Kilometer (Km)</option>
                                            <option value="Nos.">Numbers (Nos.)</option>
                                            <option value="Percentage">Percentage (%)</option>
                                            <option value="status">Status Based</option>
                                          </select>
                                        </div>
                                        
                                        {currentUnit !== "status" && (
                                          <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Planned Quantity</label>
                                            <input
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              value={subActivityPlannedQtys[key] || ''}
                                              onChange={(e) => handleSubActivityPlannedQtyChange(actName, sub.name, e.target.value)}
                                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                              placeholder="Enter qty"
                                            />
                                          </div>
                                        )}
                                        
                                        {currentUnit === "status" && (
                                          <div className="col-span-2">
                                            <div className="text-[10px] text-blue-600 bg-blue-50 p-1 rounded flex items-center gap-1">
                                              <Info size={10} />
                                              Status-based - no quantity needed
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
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
              className="text-center py-6 md:py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl"
            >
              <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs md:text-sm">Select activities above</p>
            </motion.div>
          )}

          {/* Mobile Navigation Buttons */}
          {isMobile && (
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2"
              >
                Create Project
                <CheckCircle size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Desktop Submit Button */}
        {!isMobile && (
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-base md:text-xl flex items-center gap-2 md:gap-3"
            >
              <CheckCircle size={20} />
              Create Project
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default CreateProject;