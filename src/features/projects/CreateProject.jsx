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
//   createActivity,
//   createSubActivity,
//   createActivitiesBulk,
//   createSubActivitiesBulk,
//   createProject as createProjectApi,
//   clearActivities,
//   clearSubActivities
// } from "../api/apiSlice";
// import { showSnackbar } from "../notifications/notificationSlice";
// import { addProject } from "./projectSlice";
// import { UNIT_OPTIONS } from '../../utils/unitMapping';

// // Initial master activities as fallback (will be used if API fails)
// const INITIAL_MASTER_ACTIVITIES = [
//   // {
//   //   name: "Field Team Mobilization Advance",
//   //   subActivities: [{ name: "Mobilization", unit: "status" }],
//   // },
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

//   console.log(useSelector((state) => state.api), "API data from Redux store");

  
//   const [form, setForm] = useState({
//     project_code: "",
//     project_name: "",
//     short_name: "",
//     company: "",
//     location: "",
//     sector: "",
//     client: "",
//     total_length: "",
//     workorder_cost: "",
//     gst_type: "exclude", 
//     director_proposal_date: "",
//     project_confirmation_date: "",
//     loa_date: "",
//     completion_date: "",
//   });

  
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

  
//   const [sectorsList, setSectorsList] = useState([]);
//   const [sectorsMap, setSectorsMap] = useState({});
//   const [clientsList, setClientsList] = useState([]);
//   const [clientsMap, setClientsMap] = useState({});
//   const [masterActivities, setMasterActivities] = useState(INITIAL_MASTER_ACTIVITIES);
//   const [customActivities, setCustomActivities] = useState([]);


//   const [clientSearch, setClientSearch] = useState("");
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const clientDropdownRef = useRef(null);

  
//   const [showAddSectorModal, setShowAddSectorModal] = useState(false);
//   const [showAddClientModal, setShowAddClientModal] = useState(false);
//   const [newSector, setNewSector] = useState("");
//   const [newClient, setNewClient] = useState("");

  
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [activityWeightages, setActivityWeightages] = useState({});
//   const [expandedActivity, setExpandedActivity] = useState(null);
//   const [activityDates, setActivityDates] = useState({});

  
//   const [selectedSubActivities, setSelectedSubActivities] = useState({});
//   const [subActivityPlannedQtys, setSubActivityPlannedQtys] = useState({});
//   const [subActivityUnits, setSubActivityUnits] = useState({});

  
//   const [showAddActivityModal, setShowAddActivityModal] = useState(false);
//   const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
//   const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
//   const [newActivityName, setNewActivityName] = useState("");
//   const [newSubActivity, setNewSubActivity] = useState({
//     name: "",
//     unit: "Km"
//   });

  
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         await Promise.all([
//           dispatch(fetchCompanies()),
//           dispatch(fetchSubCompanies()),
//           dispatch(fetchSectors()),
//           dispatch(fetchClients()),
//           dispatch(fetchActivities()),
//           dispatch(fetchSubActivities())
//         ]);
//       } catch (error) {
//         console.log("Using fallback data due to API error", error);
//       }
//     };

//     fetchInitialData();

    
//     return () => {
//       dispatch(clearActivities());
//       dispatch(clearSubActivities());
//     };
//   }, [dispatch]);


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

  
//   useEffect(() => {
//     console.log("Activities from API:", activities);
//     console.log("SubActivities from API:", subActivities);

//     if (activities && activities.length > 0) {
//       const activityMap = new Map();

//       activities.forEach(activity => {
//         const activitySubs = subActivities.filter(
//           sub => sub.activity === activity.id
//         ) || [];

//         const formattedActivity = {
//           id: activity.id,
//           name: activity.activity_name || activity.name,
//           subActivities: activitySubs.length > 0
//             ? activitySubs.map(sub => ({
//                 id: sub.id,
//                 name: sub.subactivity_name || sub.name,
//                 unit: sub.unit_display || sub.unit || "Km"
//               }))
//             : [],
//           isCustom: false
//         };

//         const existing = activityMap.get(formattedActivity.name);
//         if (!existing || existing.subActivities.length < formattedActivity.subActivities.length) {
//           activityMap.set(formattedActivity.name, formattedActivity);
//         }
//       });

//       const formattedActivities = Array.from(activityMap.values());
//       console.log("Formatted activities (no duplicates):", formattedActivities);
//       setMasterActivities(formattedActivities);
//     } else {
//       console.log("Using fallback activities");
//     }
//   }, [activities, subActivities]);

  
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
//         setShowClientDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

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

//   const handleGstTypeChange = (e) => {
//     setForm(prev => ({
//       ...prev,
//       gst_type: e.target.checked ? "include" : "exclude"
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

  
//   const handleAddSector = async () => {
//     if (!newSector.trim()) {
//       dispatch(showSnackbar({ message: "Please enter sector name", type: "error" }));
//       return;
//     }
//     try {
//       await dispatch(createSector({ name: newSector })).unwrap();
//       dispatch(showSnackbar({ message: "Sector added successfully", type: "success" }));
//     } catch (error) {
//       dispatch(showSnackbar({ message: "Sector added locally", type: "success" }));
//     }
//     setSectorsList(prev => [...prev, newSector]);
//     setForm(prev => ({ ...prev, sector: newSector }));
//     setNewSector("");
//     setShowAddSectorModal(false);
//   };

  
//   const handleAddClient = async () => {
//     if (!newClient.trim()) {
//       dispatch(showSnackbar({ message: "Please enter client name", type: "error" }));
//       return;
//     }
//     try {
//       await dispatch(createClient({ name: newClient })).unwrap();
//       dispatch(showSnackbar({ message: "Client added successfully", type: "success" }));
//     } catch (error) {
//       dispatch(showSnackbar({ message: "Client added locally", type: "success" }));
//     }
//     setClientsList(prev => [...prev, newClient]);
//     setForm(prev => ({ ...prev, client: newClient }));
//     setClientSearch(newClient);
//     setNewClient("");
//     setShowAddClientModal(false);
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
//       { name: "Director Proposal", value: form.director_proposal_date },
//       { name: "Project Confirmation", value: form.project_confirmation_date },
//       { name: "LOA", value: form.loa_date },
//       { name: "Completion", value: form.completion_date }
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
//     if (!form.project_code || !form.project_name || !form.short_name) {
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
//     if (!form.total_length || form.total_length <= 0) {
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

//     setIsSubmitting(true);

//     dispatch(showSnackbar({
//       message: "Creating project... This may take a moment.",
//       type: "info"
//     }));

//     try {
//       const allActivities = getAllActivities();
//       let createdActivityIds = [];
//       const activityIdMap = {};

//       const activitiesPayload = selectedActivities.map((actName) => {
//         const dates = activityDates[actName];
//         const weightage = activityWeightages[actName] || 0;

//         return {
//           activity_name: actName,
//           weightage: weightage,
//           start_date: dates.startDate,
//           end_date: dates.endDate,
//         };
//       });

//       let activitiesResponse;

//       if (typeof createActivitiesBulk !== 'undefined' && createActivitiesBulk) {
//         activitiesResponse = await dispatch(createActivitiesBulk(activitiesPayload)).unwrap();
//       } else {
//         console.warn("createActivitiesBulk not available, falling back to individual creation");
//         const activityPromises = activitiesPayload.map(activityData =>
//           dispatch(createActivity(activityData)).unwrap()
//         );
//         activitiesResponse = await Promise.all(activityPromises);
//       }

//       if (Array.isArray(activitiesResponse)) {
//         createdActivityIds = activitiesResponse.map(act => act.id);
//         selectedActivities.forEach((actName, index) => {
//           activityIdMap[actName] = activitiesResponse[index]?.id;
//         });
//       } else {
//         createdActivityIds = [activitiesResponse.id];
//         activityIdMap[selectedActivities[0]] = activitiesResponse.id;
//       }

//       const bulkSubPromises = [];

//       for (const actName of selectedActivities) {
//         const activityObj = allActivities.find((a) => a.name === actName);
//         const activityId = activityIdMap[actName];
//         const selectedSubs = selectedSubActivities[actName] || [];

//         if (selectedSubs.length === 0) continue;

//         const subActivitiesPayload = selectedSubs.map((subName) => {
//           const subObj = activityObj.subActivities.find(s => s.name === subName);
//           const key = `${actName}_${subName}`;
//           const unit = subActivityUnits[key] || subObj?.unit;
//           const plannedQty = subActivityPlannedQtys[key] || 0;
//           const submissionpayment = subActivityPlannedQtys[(key + "_subpayment")] || 0;
//           const approvalpayment = subActivityPlannedQtys[(key + "_approvalpayment")] || 0;
//           const chainagestart = subActivityPlannedQtys[(key + "_chainagestart")] || 0;
//           const chainageend = subActivityPlannedQtys[(key + "_chainageend")] || 0;
//           const description = subActivityPlannedQtys[(key + "_description")] || "";

//           const isStatusBased = unit === 'status';

//           return {
//             subactivity_name: subName,
//             unit: isStatusBased ? 'status' : unit,
//             total_quantity: isStatusBased ? 1 : plannedQty,
//             range: isStatusBased ? 'status' : null,
//             activity: activityId,
//             submission_payment: submissionpayment,
//             approval_payment: approvalpayment,
//             chainage_start: chainagestart,
//             chainage_end: chainageend,
//             description: description
//           };
//         });

//         if (typeof createSubActivitiesBulk !== 'undefined' && createSubActivitiesBulk) {
//           bulkSubPromises.push(dispatch(createSubActivitiesBulk(subActivitiesPayload)).unwrap());
//         } else {
//           const promises = subActivitiesPayload.map(data =>
//             dispatch(createSubActivity(data)).unwrap()
//           );
//           bulkSubPromises.push(Promise.all(promises));
//         }
//       }

//       if (bulkSubPromises.length > 0) {
//         await Promise.all(bulkSubPromises);
//         console.log("All sub-activities created successfully");
//       }

//       const selectedCompany = companies.find(c => c.name === form.company);
//       const sectorId = sectorsMap[form.sector] || null;
//       const clientId = clientsMap[form.client] || null;

//       const projectData = {
//         project_code: form.project_code,
//         project_name: form.project_name,
//         short_name: form.short_name,
//         company: selectedCompany?.id || null,
//         sector: sectorId,
//         client: clientId,
//         location: form.location,
//         total_length: parseFloat(form.total_length),
//         workorder_cost: parseFloat(form.workorder_cost) || 0,
//         gst_type: form.gst_type,
//         director_proposal_date: form.director_proposal_date,
//         project_confirmation_date: form.project_confirmation_date,
//         loa_date: form.loa_date,
//         completion_date: form.completion_date,
//         activities: createdActivityIds,
//       };

//       const apiResult = await dispatch(createProjectApi(projectData)).unwrap();

//       dispatch(addProject({
//         id: apiResult.id || `temp_${Date.now()}`,
//         code: form.project_code,
//         name: form.project_name,
//         shortName: form.short_name,
//         company: form.company,
//         location: form.location,
//         sector: form.sector,
//         department: form.client,
//         totalLength: form.total_length,
//         cost: form.workorder_cost,
//         directorProposalDate: form.director_proposal_date,
//         projectConfirmationDate: form.project_confirmation_date,
//         loaDate: form.loa_date,
//         completionDate: form.completion_date,
//         activities: selectedActivities.map((actName, idx) => {
//           const activityObj = allActivities.find((a) => a.name === actName);
//           const dates = activityDates[actName];
//           const selectedSubs = selectedSubActivities[actName] || [];

//           return {
//             id: createdActivityIds[idx] || `a${idx + 1}_${Date.now()}`,
//             name: actName,
//             weightage: activityWeightages[actName] || 0,
//             startDate: dates.startDate,
//             endDate: dates.endDate,
//             progress: 0,
//             subActivities: selectedSubs.map((subName, subIdx) => {
//               const subObj = activityObj.subActivities.find(s => s.name === subName);
//               const key = `${actName}_${subName}`;
//               const unit = subActivityUnits[key] || subObj?.unit;
//               const plannedQty = subActivityPlannedQtys[key] || 0;

//               return {
//                 id: `s${idx + 1}_${subIdx + 1}_${Date.now()}`,
//                 name: subName,
//                 unit: unit,
//                 plannedQty: unit !== "status" ? plannedQty : 1,
//                 completedQty: 0,
//                 progress: 0,
//                 startDate: dates.startDate,
//                 endDate: dates.endDate,
//                 status: "PENDING",
//               };
//             }),
//           };
//         }),
//       }));

//       dispatch(showSnackbar({
//         message: "Project created successfully!",
//         type: "success"
//       }));

//       navigate("/projects");
//     } catch (error) {
//       console.error("Project creation error:", error);

//       let errorMessage = "Failed to create project";

//       if (error.response?.data) {
//         if (typeof error.response.data === 'string') {
//           errorMessage = error.response.data;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         } else if (error.response.data.detail) {
//           errorMessage = error.response.data.detail;
//         } else {
//           try {
//             const errors = Object.entries(error.response.data)
//               .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
//               .join(', ');
//             if (errors) errorMessage = errors;
//           } catch {
//             errorMessage = "Unknown error occurred";
//           }
//         }
//       }

//       dispatch(showSnackbar({
//         message: errorMessage,
//         type: "error"
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const closeModal = (setter) => {
//     setter(false);
//   };

//   const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
//   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

//   const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);

//   const getUnitDisplay = (unit) => {
//     if (unit === 'status') return 'Status';
//     if (unit === 'Km') return 'Km';
//     if (unit === 'Nos.') return 'Nos';
//     if (unit === 'Percentage') return '%';
//     return unit;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-4 py-4 md:py-6"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Loading Overlay */}
//       {(loading || isSubmitting) && (
//         <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center">
//           <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
//             <Loader2 className="animate-spin text-blue-600" size={24} />
//             <p className="text-gray-700">{isSubmitting ? "Creating project..." : "Loading data..."}</p>
//           </div>
//         </div>
//       )}

//       {/* Add Sector Modal */}
//       <AnimatePresence>
//         {showAddSectorModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => closeModal(setShowAddSectorModal)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-lg md:text-xl font-bold mb-4">Add New Sector</h3>
//               <input
//                 type="text"
//                 placeholder="Enter sector name"
//                 value={newSector}
//                 onChange={(e) => setNewSector(e.target.value)}
//                 className="w-full p-3 border rounded-xl text-sm md:text-base mb-4"
//                 autoFocus
//               />
//               <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => closeModal(setShowAddSectorModal)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleAddSector}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
//                 >
//                   Add Sector
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Client Modal */}
//       <AnimatePresence>
//         {showAddClientModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => closeModal(setShowAddClientModal)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h3 className="text-lg md:text-xl font-bold mb-4">Add New Client</h3>
//               <input
//                 type="text"
//                 placeholder="Enter client name"
//                 value={newClient}
//                 onChange={(e) => setNewClient(e.target.value)}
//                 className="w-full p-3 border rounded-xl text-sm md:text-base mb-4"
//                 autoFocus
//               />
//               <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => closeModal(setShowAddClientModal)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleAddClient}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
//                 >
//                   Add Client
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Add Activity Modal - Original */}
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

//       {/* Add Sub-Activity Modal - Original */}
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
//                     onChange={(e) => setNewSubActivity({ ...newSubActivity, name: e.target.value })}
//                     className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
//                     required
//                   />

//                   <select
//                     value={newSubActivity.unit}
//                     onChange={(e) => setNewSubActivity({ ...newSubActivity, unit: e.target.value })}
//                     className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
//                   >
//                     {UNIT_OPTIONS.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
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

//       <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
//         {/* Step 1: Basic Information */}
//         <motion.div
//   initial={false}
//   animate={{
//     display: !isMobile || currentStep === 1 ? "block" : "none",
//     opacity: !isMobile || currentStep === 1 ? 1 : 0
//   }}
//   className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
// >
//   <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//     <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
//     <span>Basic Information</span>
//   </h3>

//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

//     {/* Project Code */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Project Code *</label>
//       <div className="relative">
//         <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//         <input
//           type="text"
//           name="project_code"
//           value={form.project_code}
//           onChange={handleChange}
//           className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>

//     {/* Project Name */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Project Name *</label>
//       <div className="relative">
//         <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//         <input
//           type="text"
//           name="project_name"
//           value={form.project_name}
//           onChange={handleChange}
//           className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>

//     {/* Short Name */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Short Name *</label>
//       <div className="relative">
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔤</span>
//         <input
//           type="text"
//           name="short_name"
//           value={form.short_name}
//           onChange={handleChange}
//           className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>

//     {/* Location */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Location</label>
//       <div className="relative">
//         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//         <input
//           type="text"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>

//     {/* Company */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Company *</label>
//       <div className="relative">
//         <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//         <select
//           name="company"
//           value={form.company}
//           onChange={handleChange}
//           className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 appearance-none"
//         >
//           <option value="">Select Company</option>
//           {companies.map((company) => (
//             <option key={company.id} value={company.name}>
//               {company.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>

//     {/* Sector (FIXED BUTTON ALIGNMENT) */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Sector</label>
//       <div className="relative">
//         <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

//         <select
//           name="sector"
//           value={form.sector}
//           onChange={handleChange}
//           className="w-full pl-9 pr-10 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 appearance-none"
//         >
//           <option value="">Select Sector</option>
//           {sectorsList.map((sector, i) => (
//             <option key={i} value={sector}>{sector}</option>
//           ))}
//         </select>

//         <button
//           type="button"
//           onClick={() => setShowAddSectorModal(true)}
//           className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center"
//         >
//           <Plus size={14} />
//         </button>
//       </div>
//     </div>

   
// <div className="flex flex-col gap-1">
//   <label className="text-xs text-gray-500">Client</label>

//   <div
//     className="relative"
//     ref={clientDropdownRef}
//     onClick={(e) => e.stopPropagation()}
//   >
    
//     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

    
//     <input
//       type="text"
//       value={clientSearch}
//       placeholder="Select Client"
//       onFocus={() => setShowClientDropdown(true)}
//       onChange={(e) => {
//         setClientSearch(e.target.value);
//         setShowClientDropdown(true);
//       }}
//       className="w-full pl-9 pr-16 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//     />

//     {/* Search Icon */}
//     {/* <Search className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400" size={14} /> */}

  
//     <button
//       type="button"
//       onClick={(e) => {
//         e.stopPropagation();
//         setShowAddClientModal(true);
//       }}
//       className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center"
//     >
//       <Plus size={14} />
//     </button>

    
//     {showClientDropdown && (
//       <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">

//         {(clientSearch
//           ? clients.filter((c) =>
//               c.name?.toLowerCase().includes(clientSearch.toLowerCase())
//             )
//           : clients
//         ).length > 0 ? (

//           (clientSearch
//             ? clients.filter((c) =>
//                 c.name?.toLowerCase().includes(clientSearch.toLowerCase())
//               )
//             : clients
//           ).map((client) => (
//             <div
//               key={client.id}
//               onClick={(e) => {
//                 e.stopPropagation();

//                 setForm({
//                   ...form,
//                   client: client.id   // ✅ store ID
//                 });

//                 setClientSearch(client.name); // ✅ show name
//                 setShowClientDropdown(false);
//               }}
//               className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//             >
//               {client.name}   {/* ✅ FIXED */}
//             </div>
//           ))

//         ) : (
//           <div className="px-3 py-2 text-gray-400 text-sm">
//             No clients found
//           </div>
//         )}
//       </div>
//     )}
//   </div>
// </div>
//   </div>
// </motion.div>

//        {/* Step 2: Project Specifications & Dates */}
// <motion.div
//   initial={false}
//   animate={{
//     display: !isMobile || currentStep === 2 ? "block" : "none",
//     opacity: !isMobile || currentStep === 2 ? 1 : 0
//   }}
//   className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 border border-gray-100"
// >
//   <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//     <div className="w-1 h-6 bg-green-600 rounded-full"></div>
//     <span>Project Specifications & Dates</span>
//     {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 2/3</span>}
//   </h3>

//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

//     {/* Total Length */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Total Length *</label>
//       <div className="relative">
//         <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//         <input
//           type="number"
//           name="total_length"
//           step="0.01"
//           value={form.total_length}
//           onChange={handleChange}
//           className="w-full pl-9 pr-14 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         />
//         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">km</span>
//       </div>
//     </div>

//     {/* Workorder Cost */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Workorder Cost</label>
//       <div className="relative">
//         <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//         <input
//           type="number"
//           name="workorder_cost"
//           value={form.workorder_cost}
//           onChange={handleChange}
//           className="w-full pl-9 pr-16 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         />
//         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Lakhs</span>
//       </div>
//     </div>

//     {/* GST Checkbox - FIXED */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500">Tax Option</label>

//       <div
//         onClick={handleGstTypeChange}
//         className={`h-11 flex items-center justify-between px-4 border rounded-lg cursor-pointer transition-all
//           ${form.gst_type === "include"
//             ? "border-blue-500 bg-blue-50"
//             : "border-gray-200 bg-gray-50 hover:bg-gray-100"
//           }`}
//       >
//         <span className="text-sm text-gray-700 font-medium">
//           Including GST
//         </span>

//         <input
//           type="checkbox"
//           checked={form.gst_type === "include"}
//           readOnly
//           className="w-5 h-5 text-blue-600 pointer-events-none"
//         />
//       </div>
//     </div>

//     {/* Director Proposal Date */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500 flex items-center gap-1">
//         <Calendar size={12} /> Director Proposal Date *
//       </label>
//       <input
//         type="date"
//         name="director_proposal_date"
//         value={form.director_proposal_date}
//         onChange={handleChange}
//         className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         required
//       />
//     </div>

//     {/* Project Confirmation Date */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500 flex items-center gap-1">
//         <Calendar size={12} /> Project Confirmation Date *
//       </label>
//       <input
//         type="date"
//         name="project_confirmation_date"
//         value={form.project_confirmation_date}
//         onChange={handleChange}
//         className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         required
//       />
//     </div>

//     {/* LOA Date */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500 flex items-center gap-1">
//         <Calendar size={12} /> LOA Date *
//       </label>
//       <input
//         type="date"
//         name="loa_date"
//         value={form.loa_date}
//         onChange={handleChange}
//         className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         required
//       />
//     </div>

//     {/* Completion Date */}
//     <div className="flex flex-col gap-1">
//       <label className="text-xs text-gray-500 flex items-center gap-1">
//         <Calendar size={12} /> Completion Date *
//       </label>
//       <input
//         type="date"
//         name="completion_date"
//         value={form.completion_date}
//         onChange={handleChange}
//         className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
//         required
//       />
//     </div>

//   </div>

//   {/* Mobile Navigation */}
//   {isMobile && (
//     <div className="flex justify-between mt-6">
//       <button
//         type="button"
//         onClick={prevStep}
//         className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 flex items-center gap-2 text-sm"
//       >
//         <ChevronLeft size={16} />
//         Previous
//       </button>

//       <button
//         type="button"
//         onClick={nextStep}
//         className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm"
//       >
//         Next: Activities
//         <ChevronRight size={16} />
//       </button>
//     </div>
//   )}
// </motion.div>

//         {/* Step 3: Activities - FULL ORIGINAL CODE PRESERVED */}
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
//                           const allSubs = activity.subActivities.map(sub => sub.name);
//                           setSelectedSubActivities(prev => ({
//                             ...prev,
//                             [activity.name]: allSubs
//                           }));
//                         }
//                       }}
//                       className={`cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-sm
//                         ${isSelected
//                           ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg"
//                           : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
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

//                       <AnimatePresence>
//                         {isExpanded && (
//                           <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: "auto", opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             className="border-t border-gray-200 bg-white p-3 md:p-4"
//                           >
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
//                                       <div>
//                                         <div className="grid grid-cols-3 gap-2 mt-2 pl-5">
//                                           <div>
//                                             <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
//                                             <select
//                                               value={currentUnit}
//                                               onChange={(e) => handleSubActivityUnitChange(actName, sub.name, e.target.value)}
//                                               className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                             >
//                                               {UNIT_OPTIONS.map(option => (
//                                                 <option key={option.value} value={option.value}>
//                                                   {option.label}
//                                                 </option>
//                                               ))}
//                                             </select>
//                                           </div>

//                                           {currentUnit !== "status" && (
//                                             <div>
//                                               <label className="block text-[10px] text-gray-500 mb-1">Planned Quantity</label>
//                                               <input
//                                                 type="number"
//                                                 min="0"
//                                                 step="0.01"
//                                                 value={subActivityPlannedQtys[key] || ''}
//                                                 onChange={(e) => handleSubActivityPlannedQtyChange(actName, sub.name, e.target.value)}
//                                                 className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                                 placeholder="Enter qty"
//                                               />
//                                             </div>
//                                           )}

//                                           <div>
//                                             <label className="block text-[10px] text-gray-500 mb-1">Submission Payment</label>
//                                             <input
//                                               type="number"
//                                               min="0"
//                                               step="0.01"
//                                               value={subActivityPlannedQtys[(key + "_subpayment")] || ''}
//                                               onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_subpayment"), e.target.value)}
//                                               className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                               placeholder="Enter payment in %"
//                                             />
//                                           </div>
//                                           <div>
//                                             <label className="block text-[10px] text-gray-500 mb-1">Approval Payment</label>
//                                             <input
//                                               type="number"
//                                               min="0"
//                                               step="0.01"
//                                               value={subActivityPlannedQtys[(key + "_approvalpayment")] || ''}
//                                               onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_approvalpayment"), e.target.value)}
//                                               className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                               placeholder="Enter payment in %"
//                                             />
//                                           </div>

//                                           <div className="grid grid-cols-2 gap-2 col-span-3">
//                                             <div>
//                                               <label className="block text-[10px] text-gray-500 mb-1">Chainage Start</label>
//                                               <input
//                                                 type="number"
//                                                 min="0"
//                                                 step="0.01"
//                                                 value={subActivityPlannedQtys[(key + "_chainagestart")] || ''}
//                                                 onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_chainagestart"), e.target.value)}
//                                                 className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                                 placeholder="001"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-[10px] text-gray-500 mb-1">Chainage End</label>
//                                               <input
//                                                 type="number"
//                                                 min="0"
//                                                 step="0.01"
//                                                 value={subActivityPlannedQtys[(key + "_chainageend")] || ''}
//                                                 onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_chainageend"), e.target.value)}
//                                                 className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
//                                                 placeholder="802"
//                                               />
//                                             </div>
//                                           </div>

//                                           {currentUnit === "status" && (
//                                             <div className="col-span-3">
//                                               <div className="text-[10px] text-blue-600 bg-blue-50 p-1 rounded flex items-center gap-1">
//                                                 <Info size={10} />
//                                                 Status-based - no quantity needed
//                                               </div>
//                                             </div>
//                                           )}
//                                         </div>
//                                         <div className="ml-4 py-2">
//                                           <label className="block text-[10px] text-gray-500 mb-1">Description</label>
//                                           <textarea
//                                             value={subActivityPlannedQtys[key + "_description"] || ''}
//                                             onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_description"), e.target.value)}
//                                             className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 mt-2"
//                                             placeholder="Enter any specific details or instructions for this sub-activity"
//                                             rows={2}
//                                           />
//                                         </div>
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
//                 disabled={isSubmitting}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="animate-spin" size={16} />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     Create Project
//                     <CheckCircle size={16} />
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </motion.div>

//         {!isMobile && (
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-base md:text-xl flex items-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="animate-spin" size={20} />
//                   Creating Project...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={20} />
//                   Create Project
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default CreateProject;




import { useState, useEffect, useRef } from "react";
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
  createActivity,
  createSubActivity,
  createActivitiesBulk,
  createSubActivitiesBulk,
  createProject as createProjectApi,
  clearActivities,
  clearSubActivities
} from "../api/apiSlice";
import { showSnackbar } from "../notifications/notificationSlice";
import { addProject } from "./projectSlice";
import { UNIT_OPTIONS } from '../../utils/unitMapping';
//fallback
const INITIAL_MASTER_ACTIVITIES = [
  {
  name: "Field Team Mobilization Advance",
  subActivities: [{ name: "Mobilization", unit: "status" }],
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
    ],
  },
];
const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    companies = [],
    // subCompanies = [],
    sectors = [],
    clients = [],
    activities = [],
    subActivities = [],
    loading
  } = useSelector((state) => state.api);
  console.log(useSelector((state) => state.api), "API data from Redux store");
 
  const [form, setForm] = useState({
    project_code: "",
    project_name: "",
    short_name: "",
    company: "",
    location: "",
    sector: "",
    client: "",
    total_length: "",
    workorder_cost: "",
    gst_type: "exclude",
    director_proposal_date: "",
    project_confirmation_date: "",
    loa_date: "",
    completion_date: "",
  });
 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const [sectorsList, setSectorsList] = useState([]);
  const [sectorsMap, setSectorsMap] = useState({});
  const [clientsList, setClientsList] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [masterActivities, setMasterActivities] = useState(INITIAL_MASTER_ACTIVITIES);
  const [customActivities, setCustomActivities] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientDropdownRef = useRef(null);
 
  const [showAddSectorModal, setShowAddSectorModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newSector, setNewSector] = useState("");
  const [newClient, setNewClient] = useState("");
 
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activityWeightages, setActivityWeightages] = useState({});
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [activityDates, setActivityDates] = useState({});
 
  const [selectedSubActivities, setSelectedSubActivities] = useState({});
  const [subActivityPlannedQtys, setSubActivityPlannedQtys] = useState({});
  const [subActivityUnits, setSubActivityUnits] = useState({});
 
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
  const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
  const [newActivityName, setNewActivityName] = useState("");
  const [newSubActivity, setNewSubActivity] = useState({
    name: "",
    unit: "Km"
  });
 
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCompanies()),
          dispatch(fetchSubCompanies()),
          dispatch(fetchSectors()),
          dispatch(fetchClients()),
          dispatch(fetchActivities()),
          dispatch(fetchSubActivities())
        ]);
      } catch (error) {
        console.log("Using fallback data due to API error", error);
      }
    };
    fetchInitialData();
   
    return () => {
      dispatch(clearActivities());
      dispatch(clearSubActivities());
    };
  }, [dispatch]);
  useEffect(() => {
    if (sectors && sectors.length > 0) {
      const map = {};
      sectors.forEach(sector => {
        map[sector.name] = sector.id;
      });
      setSectorsMap(map);
      const uniqueSectors = [...new Set(sectors.map(s => s.name))];
      setSectorsList(uniqueSectors);
    } else {
      setSectorsList(["Highway", "Bridge", "Metro", "Railway", "Building"]);
    }
  }, [sectors]);
 
  useEffect(() => {
    if (clients && clients.length > 0) {
      const map = {};
      clients.forEach(client => {
        map[client.name] = client.id;
      });
      setClientsMap(map);
      const uniqueClients = [...new Set(clients.map(c => c.name))];
      setClientsList(uniqueClients);
    } else {
      setClientsList([
        "A S Traders", "AGIPL", "Ajay Parkash", "AMAG", "Ambar Infra",
        "Ambay Infra", "Amit Chopra", "Apco", "Arcons", "Arnac",
        "BCC", "BRO", "Ceigall", "DCC", "Gawar",
        "HG Infra", "KCC", "MRG", "PNC", "RKC",
        "Sadbhav", "SKS Infra", "VRC"
      ]);
    }
  }, [clients]);
 
  useEffect(() => {
    console.log("Activities from API:", activities);
    console.log("SubActivities from API:", subActivities);
    if (activities && activities.length > 0) {
      const activityMap = new Map();
      activities.forEach(activity => {
        const activitySubs = subActivities.filter(
          sub => sub.activity === activity.id
        ) || [];
        const formattedActivity = {
          id: activity.id,
          name: activity.activity_name || activity.name,
          subActivities: activitySubs.length > 0
            ? activitySubs.map(sub => ({
                id: sub.id,
                name: sub.subactivity_name || sub.name,
                unit: sub.unit_display || sub.unit || "Km"
              }))
            : [],
          isCustom: false
        };
        const existing = activityMap.get(formattedActivity.name);
        if (!existing || existing.subActivities.length < formattedActivity.subActivities.length) {
          activityMap.set(formattedActivity.name, formattedActivity);
        }
      });
      const formattedActivities = Array.from(activityMap.values());
      console.log("Formatted activities (no duplicates):", formattedActivities);
      setMasterActivities(formattedActivities);
    } else {
      console.log("Using fallback activities");
    }
  }, [activities, subActivities]);
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const filteredClients = clientsList.filter(client =>
    client.toLowerCase().includes(clientSearch.toLowerCase())
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleGstTypeChange = (e) => {
    setForm(prev => ({
      ...prev,
      gst_type: e.target.checked ? "include" : "exclude"
    }));
  };
  const handleActivityDateChange = (activityName, field, value) => {
    setActivityDates(prev => ({
      ...prev,
      [activityName]: {
        ...prev[activityName],
        [field]: value
      }
    }));
  };
  const handleActivityWeightageChange = (activityName, value) => {
    const numValue = parseFloat(value) || 0;
    setActivityWeightages(prev => ({
      ...prev,
      [activityName]: numValue
    }));
  };
  const handleSubActivitySelection = (activityName, subActivityName, checked) => {
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
  };
  const handleSubActivityUnitChange = (activityName, subActivityName, unit) => {
    setSubActivityUnits(prev => ({
      ...prev,
      [`${activityName}_${subActivityName}`]: unit
    }));
  };
  const handleSubActivityPlannedQtyChange = (activityName, subActivityName, value) => {
    const numValue = parseFloat(value) || 0;
    setSubActivityPlannedQtys(prev => ({
      ...prev,
      [`${activityName}_${subActivityName}`]: numValue
    }));
  };
 
  const handleAddSector = async () => {
    if (!newSector.trim()) {
      dispatch(showSnackbar({ message: "Please enter sector name", type: "error" }));
      return;
    }
    try {
      await dispatch(createSector({ name: newSector })).unwrap();
      dispatch(showSnackbar({ message: "Sector added successfully", type: "success" }));
    } catch (error) {
      dispatch(showSnackbar({ message: "Sector added locally", type: "success" }));
    }
    setSectorsList(prev => [...prev, newSector]);
    setForm(prev => ({ ...prev, sector: newSector }));
    setNewSector("");
    setShowAddSectorModal(false);
  };
 
  const handleAddClient = async () => {
    if (!newClient.trim()) {
      dispatch(showSnackbar({ message: "Please enter client name", type: "error" }));
      return;
    }
    try {
      const createdClient = await dispatch(createClient({ name: newClient })).unwrap();
      dispatch(showSnackbar({ message: "Client added successfully", type: "success" }));
      setClientsList(prev => [...prev, newClient]);
      setForm(prev => ({ ...prev, client: createdClient.id })); // FIXED: now stores ID from API response
      setClientSearch(newClient);
      setNewClient("");
      setShowAddClientModal(false);
    } catch (error) {
      dispatch(showSnackbar({ message: "Client added locally", type: "success" }));
      setClientsList(prev => [...prev, newClient]);
      setClientSearch(newClient);
      setNewClient("");
      setShowAddClientModal(false);
    }
  };
  const handleAddActivity = async (e) => {
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
  };
  const handleAddSubActivity = async (e) => {
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
      name: newSubActivity.name,
      unit: newSubActivity.unit
    };
    const masterIndex = masterActivities.findIndex(act => act.name === selectedActivityForSub);
    if (masterIndex !== -1) {
      setMasterActivities(prev => prev.map((act, index) => {
        if (index === masterIndex) {
          return {
            ...act,
            subActivities: [...act.subActivities, newSub]
          };
        }
        return act;
      }));
    } else {
      setCustomActivities(prev => prev.map(act => {
        if (act.name === selectedActivityForSub) {
          return {
            ...act,
            subActivities: [...act.subActivities, newSub]
          };
        }
        return act;
      }));
    }
    setNewSubActivity({ name: "", unit: "Km" });
    setShowAddSubActivityModal(false);
    setSelectedActivityForSub(null);
    dispatch(showSnackbar({
      message: "Sub-activity added successfully",
      type: "success"
    }));
  };
  const handleDeleteActivity = (activityName) => {
    if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
      setCustomActivities(prev => prev.filter(a => a.name !== activityName));
      setSelectedActivities(prev => prev.filter(a => a !== activityName));
      const newWeightages = { ...activityWeightages };
      delete newWeightages[activityName];
      setActivityWeightages(newWeightages);
      const newDates = { ...activityDates };
      delete newDates[activityName];
      setActivityDates(newDates);
      const newSubSelections = { ...selectedSubActivities };
      delete newSubSelections[activityName];
      setSelectedSubActivities(newSubSelections);
      dispatch(showSnackbar({
        message: "Activity deleted successfully",
        type: "success"
      }));
    }
  };
  const handleDeleteSubActivity = (activityName, subActivityName) => {
    if (window.confirm(`Are you sure you want to delete sub-activity "${subActivityName}"?`)) {
      const masterIndex = masterActivities.findIndex(act => act.name === activityName);
      if (masterIndex !== -1) {
        setMasterActivities(prev => prev.map(act => {
          if (act.name === activityName) {
            return {
              ...act,
              subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
            };
          }
          return act;
        }));
      } else {
        setCustomActivities(prev => prev.map(act => {
          if (act.name === activityName) {
            return {
              ...act,
              subActivities: act.subActivities.filter(sub => sub.name !== subActivityName)
            };
          }
          return act;
        }));
      }
      const key = `${activityName}_${subActivityName}`;
      const newUnits = { ...subActivityUnits };
      delete newUnits[key];
      setSubActivityUnits(newUnits);
      const newQtys = { ...subActivityPlannedQtys };
      delete newQtys[key];
      setSubActivityPlannedQtys(newQtys);
      if (selectedSubActivities[activityName]) {
        setSelectedSubActivities(prev => ({
          ...prev,
          [activityName]: prev[activityName].filter(name => name !== subActivityName)
        }));
      }
      dispatch(showSnackbar({
        message: "Sub-activity deleted successfully",
        type: "success"
      }));
    }
  };
  const getAllActivities = () => {
    return [...masterActivities, ...customActivities];
  };
  const validateDates = () => {
    const dates = [
      { name: "Director Proposal", value: form.director_proposal_date },
      { name: "Project Confirmation", value: form.project_confirmation_date },
      { name: "LOA", value: form.loa_date },
      { name: "Completion", value: form.completion_date }
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
  };
  const validate = () => {
    if (!form.project_code || !form.project_name || !form.short_name) {
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
    if (!form.total_length || form.total_length <= 0) {
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
    const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);
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
      const activityObj = getAllActivities().find((a) => a.name === activityName);
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
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validate()) return;
    setIsSubmitting(true);
    dispatch(showSnackbar({
      message: "Creating project... This may take a moment.",
      type: "info"
    }));
    try {
      const allActivities = getAllActivities();
      let createdActivityIds = [];
      const activityIdMap = {};
      const activitiesPayload = selectedActivities.map((actName) => {
        const dates = activityDates[actName];
        const weightage = activityWeightages[actName] || 0;
        return {
          activity_name: actName,
          weightage: weightage,
          start_date: dates.startDate,
          end_date: dates.endDate,
        };
      });
      let activitiesResponse;
      if (typeof createActivitiesBulk !== 'undefined' && createActivitiesBulk) {
        activitiesResponse = await dispatch(createActivitiesBulk(activitiesPayload)).unwrap();
      } else {
        console.warn("createActivitiesBulk not available, falling back to individual creation");
        const activityPromises = activitiesPayload.map(activityData =>
          dispatch(createActivity(activityData)).unwrap()
        );
        activitiesResponse = await Promise.all(activityPromises);
      }
      if (Array.isArray(activitiesResponse)) {
        createdActivityIds = activitiesResponse.map(act => act.id);
        selectedActivities.forEach((actName, index) => {
          activityIdMap[actName] = activitiesResponse[index]?.id;
        });
      } else {
        createdActivityIds = [activitiesResponse.id];
        activityIdMap[selectedActivities[0]] = activitiesResponse.id;
      }
      const bulkSubPromises = [];
      for (const actName of selectedActivities) {
        const activityObj = allActivities.find((a) => a.name === actName);
        const activityId = activityIdMap[actName];
        const selectedSubs = selectedSubActivities[actName] || [];
        if (selectedSubs.length === 0) continue;
        const subActivitiesPayload = selectedSubs.map((subName) => {
          const subObj = activityObj.subActivities.find(s => s.name === subName);
          const key = `${actName}_${subName}`;
          const unit = subActivityUnits[key] || subObj?.unit;
          const plannedQty = subActivityPlannedQtys[key] || 0;
          const submissionpayment = subActivityPlannedQtys[(key + "_subpayment")] || 0;
          const approvalpayment = subActivityPlannedQtys[(key + "_approvalpayment")] || 0;
          const chainagestart = subActivityPlannedQtys[(key + "_chainagestart")] || 0;
          const chainageend = subActivityPlannedQtys[(key + "_chainageend")] || 0;
          const description = subActivityPlannedQtys[(key + "_description")] || "";
          const isStatusBased = unit === 'status';
          return {
            subactivity_name: subName,
            unit: isStatusBased ? 'status' : unit,
            total_quantity: isStatusBased ? 1 : plannedQty,
            range: isStatusBased ? 'status' : null,
            activity: activityId,
            submission_payment: submissionpayment,
            approval_payment: approvalpayment,
            chainage_start: chainagestart,
            chainage_end: chainageend,
            description: description
          };
        });
        if (typeof createSubActivitiesBulk !== 'undefined' && createSubActivitiesBulk) {
          bulkSubPromises.push(dispatch(createSubActivitiesBulk(subActivitiesPayload)).unwrap());
        } else {
          const promises = subActivitiesPayload.map(data =>
            dispatch(createSubActivity(data)).unwrap()
          );
          bulkSubPromises.push(Promise.all(promises));
        }
      }
      if (bulkSubPromises.length > 0) {
        await Promise.all(bulkSubPromises);
        console.log("All sub-activities created successfully");
      }
      const selectedCompany = companies.find(c => c.name === form.company);
      const sectorId = sectorsMap[form.sector] || null;
      const clientId = form.client || null; // FIXED: now directly uses ID stored in form.client (no more clientsMap lookup)
      const projectData = {
        project_code: form.project_code,
        project_name: form.project_name,
        short_name: form.short_name,
        company: selectedCompany?.id || null,
        sector: sectorId,
        client: clientId,
        sub_company: undefined, // FIXED: added to satisfy backend (accepts null/blank as per your requirement)
        location: form.location,
        total_length: parseFloat(form.total_length),
        workorder_cost: parseFloat(form.workorder_cost) || 0,
        gst_type: form.gst_type,
        director_proposal_date: form.director_proposal_date,
        project_confirmation_date: form.project_confirmation_date,
        loa_date: form.loa_date,
        completion_date: form.completion_date,
        activities: createdActivityIds,
      };
      const apiResult = await dispatch(createProjectApi(projectData)).unwrap();
      dispatch(addProject({
        id: apiResult.id || `temp_${Date.now()}`,
        code: form.project_code,
        name: form.project_name,
        shortName: form.short_name,
        company: form.company,
        location: form.location,
        sector: form.sector,
        department: form.client,
        totalLength: form.total_length,
        cost: form.workorder_cost,
        directorProposalDate: form.director_proposal_date,
        projectConfirmationDate: form.project_confirmation_date,
        loaDate: form.loa_date,
        completionDate: form.completion_date,
        activities: selectedActivities.map((actName, idx) => {
          const activityObj = allActivities.find((a) => a.name === actName);
          const dates = activityDates[actName];
          const selectedSubs = selectedSubActivities[actName] || [];
          return {
            id: createdActivityIds[idx] || `a${idx + 1}_${Date.now()}`,
            name: actName,
            weightage: activityWeightages[actName] || 0,
            startDate: dates.startDate,
            endDate: dates.endDate,
            progress: 0,
            subActivities: selectedSubs.map((subName, subIdx) => {
              const subObj = activityObj.subActivities.find(s => s.name === subName);
              const key = `${actName}_${subName}`;
              const unit = subActivityUnits[key] || subObj?.unit;
              const plannedQty = subActivityPlannedQtys[key] || 0;
              return {
                id: `s${idx + 1}_${subIdx + 1}_${Date.now()}`,
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
      console.error("Project creation error:", error);
      let errorMessage = "Failed to create project";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else {
          try {
            const errors = Object.entries(error.response.data)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join(', ');
            if (errors) errorMessage = errors;
          } catch {
            errorMessage = "Unknown error occurred";
          }
        }
      }
      dispatch(showSnackbar({
        message: errorMessage,
        type: "error"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  const closeModal = (setter) => {
    setter(false);
  };
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const totalWeightage = Object.values(activityWeightages).reduce((sum, w) => sum + (w || 0), 0);
  const getUnitDisplay = (unit) => {
    if (unit === 'status') return 'Status';
    if (unit === 'Km') return 'Km';
    if (unit === 'Nos.') return 'Nos';
    if (unit === 'Percentage') return '%';
    return unit;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-4 py-4 md:py-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Loading Overlay */}
      {(loading || isSubmitting) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <p className="text-gray-700">{isSubmitting ? "Creating project..." : "Loading data..."}</p>
          </div>
        </div>
      )}
      {/* Add Sector Modal */}
      <AnimatePresence>
        {showAddSectorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => closeModal(setShowAddSectorModal)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg md:text-xl font-bold mb-4">Add New Sector</h3>
              <input
                type="text"
                placeholder="Enter sector name"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm md:text-base mb-4"
                autoFocus
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => closeModal(setShowAddSectorModal)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSector}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
                >
                  Add Sector
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddClientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => closeModal(setShowAddClientModal)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg md:text-xl font-bold mb-4">Add New Client</h3>
              <input
                type="text"
                placeholder="Enter client name"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm md:text-base mb-4"
                autoFocus
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => closeModal(setShowAddClientModal)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddClient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
                >
                  Add Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Add Activity Modal - Original */}
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
      {/* Add Sub-Activity Modal - Original */}
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
                    onChange={(e) => setNewSubActivity({ ...newSubActivity, name: e.target.value })}
                    className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
                    required
                  />
                  <select
                    value={newSubActivity.unit}
                    onChange={(e) => setNewSubActivity({ ...newSubActivity, unit: e.target.value })}
                    className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
                  >
                    {UNIT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
      {/* Header with Mobile Step Indicator */}
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
  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
    <span>Basic Information</span>
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {/* Project Code */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Project Code *</label>
      <div className="relative">
        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          name="project_code"
          value={form.project_code}
          onChange={handleChange}
          className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    {/* Project Name */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Project Name *</label>
      <div className="relative">
        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          name="project_name"
          value={form.project_name}
          onChange={handleChange}
          className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    {/* Short Name */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Short Name *</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔤</span>
        <input
          type="text"
          name="short_name"
          value={form.short_name}
          onChange={handleChange}
          className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    {/* Location */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Location</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    {/* Company */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Company *</label>
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <select
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full pl-9 pr-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
    </div>
    {/* Sector (FIXED BUTTON ALIGNMENT) */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Sector</label>
      <div className="relative">
        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <select
          name="sector"
          value={form.sector}
          onChange={handleChange}
          className="w-full pl-9 pr-10 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="">Select Sector</option>
          {sectorsList.map((sector, i) => (
            <option key={i} value={sector}>{sector}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAddSectorModal(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  
<div className="flex flex-col gap-1">
  <label className="text-xs text-gray-500">Client</label>
  <div
    className="relative"
    ref={clientDropdownRef}
    onClick={(e) => e.stopPropagation()}
  >
   
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
   
    <input
      type="text"
      value={clientSearch}
      placeholder="Select Client"
      onFocus={() => setShowClientDropdown(true)}
      onChange={(e) => {
        setClientSearch(e.target.value);
        setShowClientDropdown(true);
      }}
      className="w-full pl-9 pr-16 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
    />
    {/* Search Icon */}
    {/* <Search className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400" size={14} /> */}
 
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShowAddClientModal(true);
      }}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
    >
      <Plus size={14} />
    </button>
   
    {showClientDropdown && (
      <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {(clientSearch
          ? clients.filter((c) =>
              c.name?.toLowerCase().includes(clientSearch.toLowerCase())
            )
          : clients
        ).length > 0 ? (
          (clientSearch
            ? clients.filter((c) =>
                c.name?.toLowerCase().includes(clientSearch.toLowerCase())
              )
            : clients
          ).map((client) => (
            <div
              key={client.id}
              onClick={(e) => {
                e.stopPropagation();
                setForm({
                  ...form,
                  client: client.id // ✅ store ID
                });
                setClientSearch(client.name); // ✅ show name
                setShowClientDropdown(false);
              }}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {client.name} {/* ✅ FIXED */}
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-gray-400 text-sm">
            No clients found
          </div>
        )}
      </div>
    )}
  </div>
</div>
  </div>
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
  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
    <span>Project Specifications & Dates</span>
    {isMobile && <span className="text-xs text-gray-500 ml-auto">Step 2/3</span>}
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {/* Total Length */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Total Length *</label>
      <div className="relative">
        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="number"
          name="total_length"
          step="0.01"
          value={form.total_length}
          onChange={handleChange}
          className="w-full pl-9 pr-14 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">km</span>
      </div>
    </div>
    {/* Workorder Cost */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">Workorder Cost</label>
      <div className="relative">
        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="number"
          name="workorder_cost"
          value={form.workorder_cost}
          onChange={handleChange}
          className="w-full pl-9 pr-16 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Lakhs</span>
      </div>
    </div>
    
<div className="flex flex-col gap-1">
  <label className="text-xs text-gray-500">Tax Option</label>
  <div
    onClick={() => {
      setForm(prev => ({
        ...prev,
        gst_type: prev.gst_type === "include" ? "exclude" : "include"
      }));
    }}
    className={`h-11 flex items-center justify-between px-4 border rounded-lg cursor-pointer transition-all select-none
      ${form.gst_type === "include"
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
      }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 font-medium">
        Including GST
      </span>
      {form.gst_type === "include" && (
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
          INCLUDED
        </span>
      )}
    </div>

    {/* Custom Toggle Switch */}
    <div className={`w-11 h-6 rounded-full p-0.5 transition-all duration-200 flex items-center
      ${form.gst_type === "include" ? "bg-blue-600" : "bg-gray-300"}`}>
      <div 
        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200
          ${form.gst_type === "include" ? "translate-x-5" : "translate-x-0"}`}
      />
    </div>
  </div>
  <p className="text-[10px] text-gray-500 mt-0.5">
    {form.gst_type === "include" 
      ? "GST will be included in the workorder cost" 
      : "GST will be excluded from the workorder cost"}
  </p>
</div>
    {/* Director Proposal Date */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 flex items-center gap-1">
        <Calendar size={12} /> Director Proposal Date *
      </label>
      <input
        type="date"
        name="director_proposal_date"
        value={form.director_proposal_date}
        onChange={handleChange}
        className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    {/* Project Confirmation Date */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 flex items-center gap-1">
        <Calendar size={12} /> Project Confirmation Date *
      </label>
      <input
        type="date"
        name="project_confirmation_date"
        value={form.project_confirmation_date}
        onChange={handleChange}
        className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    {/* LOA Date */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 flex items-center gap-1">
        <Calendar size={12} /> LOA Date *
      </label>
      <input
        type="date"
        name="loa_date"
        value={form.loa_date}
        onChange={handleChange}
        className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    {/* Completion Date */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 flex items-center gap-1">
        <Calendar size={12} /> Completion Date *
      </label>
      <input
        type="date"
        name="completion_date"
        value={form.completion_date}
        onChange={handleChange}
        className="w-full px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  </div>
  {/* Mobile Navigation */}
  {isMobile && (
    <div className="flex justify-between mt-6">
      <button
        type="button"
        onClick={prevStep}
        className="bg-gray-600 text-white px-6 py-2.5 rounded-xl hover:bg-gray-700 flex items-center gap-2 text-sm"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <button
        type="button"
        onClick={nextStep}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm"
      >
        Next: Activities
        <ChevronRight size={16} />
      </button>
    </div>
  )}
</motion.div>
        {/* Step 3: Activities - FULL ORIGINAL CODE PRESERVED */}
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
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading activities...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              {getAllActivities().map((activity, index) => {
                const isSelected = selectedActivities.includes(activity.name);
                const isCustom = activity.isCustom;
                const uniqueKey = `activity-${index}-${activity.name}`;
                return (
                  <div key={uniqueKey} className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedActivities(prev => prev.filter((a) => a !== activity.name));
                          const newWeightages = { ...activityWeightages };
                          delete newWeightages[activity.name];
                          setActivityWeightages(newWeightages);
                          const newDates = { ...activityDates };
                          delete newDates[activity.name];
                          setActivityDates(newDates);
                          const newSubSelections = { ...selectedSubActivities };
                          delete newSubSelections[activity.name];
                          setSelectedSubActivities(newSubSelections);
                        } else {
                          setSelectedActivities(prev => [...prev, activity.name]);
                          const allSubs = activity.subActivities.map(sub => sub.name);
                          setSelectedSubActivities(prev => ({
                            ...prev,
                            [activity.name]: allSubs
                          }));
                        }
                      }}
                      className={`cursor-pointer p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all shadow-sm
                        ${isSelected
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
          )}
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
                  const activityObj = getAllActivities().find((a) => a.name === actName);
                  const isExpanded = expandedActivity === actName;
                  const isCustom = activityObj?.isCustom;
                  const selectedSubs = selectedSubActivities[actName] || [];
                  return (
                    <motion.div
                      key={`config-${actName}`}
                      layout
                      className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50"
                    >
                      <div
                        onClick={() => setExpandedActivity(isExpanded ? null : actName)}
                        className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-gray-400'}`} />
                          <h5 className="font-medium md:font-semibold text-gray-800 text-sm md:text-base truncate">
                            {actName}
                          </h5>
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
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-200 bg-white p-3 md:p-4"
                          >
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
                                const subUniqueKey = `sub-${actName}-${subIndex}-${sub.name}`;
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
                                      <div>
                                        <div className="grid grid-cols-3 gap-2 mt-2 pl-5">
                                          <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
                                            <select
                                              value={currentUnit}
                                              onChange={(e) => handleSubActivityUnitChange(actName, sub.name, e.target.value)}
                                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                            >
                                              {UNIT_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                  {option.label}
                                                </option>
                                              ))}
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
                                          <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Submission Payment</label>
                                            <input
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              value={subActivityPlannedQtys[(key + "_subpayment")] || ''}
                                              onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_subpayment"), e.target.value)}
                                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                              placeholder="Enter payment in %"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Approval Payment</label>
                                            <input
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              value={subActivityPlannedQtys[(key + "_approvalpayment")] || ''}
                                              onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_approvalpayment"), e.target.value)}
                                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                              placeholder="Enter payment in %"
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 col-span-3">
                                            <div>
                                              <label className="block text-[10px] text-gray-500 mb-1">Chainage Start</label>
                                              <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={subActivityPlannedQtys[(key + "_chainagestart")] || ''}
                                                onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_chainagestart"), e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                                placeholder="001"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[10px] text-gray-500 mb-1">Chainage End</label>
                                              <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={subActivityPlannedQtys[(key + "_chainageend")] || ''}
                                                onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_chainageend"), e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                                placeholder="802"
                                              />
                                            </div>
                                          </div>
                                          {currentUnit === "status" && (
                                            <div className="col-span-3">
                                              <div className="text-[10px] text-blue-600 bg-blue-50 p-1 rounded flex items-center gap-1">
                                                <Info size={10} />
                                                Status-based - no quantity needed
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-4 py-2">
                                          <label className="block text-[10px] text-gray-500 mb-1">Description</label>
                                          <textarea
                                            value={subActivityPlannedQtys[key + "_description"] || ''}
                                            onChange={(e) => handleSubActivityPlannedQtyChange(actName, (sub.name + "_description"), e.target.value)}
                                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 mt-2"
                                            placeholder="Enter any specific details or instructions for this sub-activity"
                                            rows={2}
                                          />
                                        </div>
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
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Project
                    <CheckCircle size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
        {!isMobile && (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 md:px-16 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-base md:text-xl flex items-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Project...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Create Project
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};
export default CreateProject;