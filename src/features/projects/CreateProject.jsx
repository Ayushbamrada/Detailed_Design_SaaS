import { useState, useEffect, useRef } from "react";
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
  AlertCircle
} from "lucide-react";

// Make MASTER_ACTIVITIES mutable by copying to state
const INITIAL_MASTER_ACTIVITIES = [
  {
    name: "Field Team Mobilization Advance",
    subActivities: [{ name: "Mobilization", unit: "status", defaultPlanned: 1 }],
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
      { name: "PDR", unit: "status", defaultPlanned: 1 },
      { name: "DBR", unit: "status", defaultPlanned: 1 },
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
      { name: "Tunnel Design", unit: "status", defaultPlanned: 1 },
      { name: "Cut and Cover Design", unit: "status", defaultPlanned: 1 },
      { name: "Slope Protection", unit: "Km", defaultPlanned: 30 },
      { name: "Retaining Wall/Toe/RE wall/Breast Wall/RS wall", unit: "status", defaultPlanned: 1 },
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

  // Form state
  const [form, setForm] = useState({
    code: "",
    name: "",
    shortName: "",
    company: "CivilMantra ConsAi Ltd", // Default company
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

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentStep, setCurrentStep] = useState(1);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Search and filter states
  const [sectors, setSectors] = useState(["Highway", "Bridge", "Metro", "Railway", "Building"]);
  const [clients, setClients] = useState([
    "A S Traders", "AGIPL", "Ajay Parkash", "AMAG", "Ambar Infra", "Ambay Infra",
    "Amit Chopra", "Apco", "Arcons", "Arnac", "Barbrik", "BCC", "Beigh Construction",
    "Bharat", "BI", "BNA", "BRO", "BRS", "CDS", "Ceigall", "Chaudhary Construction",
    "Chopra/Shreya", "Ciegall", "Classic Infra", "Classic Infra / Neeraj Agarwal",
    "CS Construction", "DCC", "Devyash", "Devyash/Digvijay", "Dhar Construction",
    "Dhariwal", "Dhariwal/MRG", "DHD", "Dhingra Brothers", "DMR", "DPS", "DRA",
    "Dynasty Promoters", "Ganesh Builders", "Ganesh Garia", "Garg Sons",
    "Gaurav Aehlawat", "Gawar", "GE", "Geetech", "GHV", "Giriraj Construction",
    "Griffin", "GRTC", "GSC", "HG Infra", "Hillways", "HP Madhukar", "Imtiaz",
    "ISC", "Jandu", "Kaluwala", "Kamal Contractor", "KCC", "KCVR", "Keystone",
    "KG Gupta", "KRC", "Krishna Projects", "Mahavir Gupta & sons (RKC)",
    "Mahavir Sharma / Sumit Singh", "Mann Builders", "MCL", "Mosh Vari", "MRG",
    "MSC", "MSC HP", "Nadbindu", "Nagyan", "Neeraj Cements", "NKG", "NU", "Oasis",
    "Pankaj Kumar Goel", "Pappu prasad", "Peto Dumpum", "PNC", "PRA",
    "Preeti Buildcon", "Preeti Buildicon", "PS Construction", "R&C", "Rahil Wazir",
    "Raj Corporation", "Rajender singh", "Rajindra Construction", "Rajpath",
    "Ravi Infra", "RCC", "Reliance", "RIPL", "RKC", "RL & Sons", "SAC", "SAC-RIPL",
    "Sadbhav", "Sarvodya Infra", "Satish AG", "SCPL", "SGI", "Sharma Construction",
    "Shri Mohangarh Const. Co.", "Singla", "Singla Construction", "SKS Infra",
    "Skylark", "SMS Ltd", "Snal Infra", "SPL", "SRC-MSA JV", "SRM", "SS Builders",
    "SS Builders/A Square", "Subash Agarwal", "Sunmaya", "Sunny Infra",
    "Sunny Infra Projects Pvt Ltd", "Tejwant rai", "Terrain Infra", "TMAP",
    "Topden Puning", "Tumas", "Uma Construction", "V&H", "Vindhya Company",
    "Vindhya Construction", "Vishwakarma Enterprises", "VRC", "Notch"
  ]);
  
  // Search states
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientDropdownRef = useRef(null);
  
  const [newSector, setNewSector] = useState("");
  const [newClient, setNewClient] = useState("");
  
  // Activity states
  const [masterActivities, setMasterActivities] = useState(INITIAL_MASTER_ACTIVITIES);
  const [customActivities, setCustomActivities] = useState([]);
  
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [activityDates, setActivityDates] = useState({});
  
  // Modal states
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddSubActivityModal, setShowAddSubActivityModal] = useState(false);
  const [selectedActivityForSub, setSelectedActivityForSub] = useState(null);
  const [newActivityName, setNewActivityName] = useState("");
  const [newSubActivity, setNewSubActivity] = useState({
    name: "",
    unit: "Km",
    defaultPlanned: 0
  });

  // Handle resize for responsive
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

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
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

  const handleAddActivity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newActivityName.trim()) {
      alert("Please enter activity name");
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
  };

  const handleAddSubActivity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newSubActivity.name.trim()) {
      alert("Please enter sub-activity name");
      return;
    }

    if (newSubActivity.unit !== "status" && (!newSubActivity.defaultPlanned || newSubActivity.defaultPlanned <= 0)) {
      alert("Please enter planned quantity");
      return;
    }

    const newSub = { 
      name: newSubActivity.name, 
      unit: newSubActivity.unit, 
      defaultPlanned: newSubActivity.unit !== "status" ? parseFloat(newSubActivity.defaultPlanned) : 1
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

    setNewSubActivity({ name: "", unit: "Km", defaultPlanned: 0 });
    setShowAddSubActivityModal(false);
    setSelectedActivityForSub(null);
  };

  const handleDeleteActivity = (activityName) => {
    if (window.confirm(`Are you sure you want to delete activity "${activityName}"?`)) {
      setCustomActivities(prev => prev.filter(a => a.name !== activityName));
      setSelectedActivities(prev => prev.filter(a => a !== activityName));
      setActivityDates(prev => {
        const newDates = { ...prev };
        delete newDates[activityName];
        return newDates;
      });
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
    }
  };

  const getAllActivities = () => {
    return [...masterActivities, ...customActivities];
  };

  const validate = () => {
    if (!form.code || !form.name || !form.shortName) {
      alert("Please fill mandatory fields: Project Code, Name, and Short Name");
      return false;
    }
    if (!form.company) {
      alert("Please select a Company");
      return false;
    }
    if (!form.totalLength || form.totalLength <= 0) {
      alert("Please enter a valid Total Length");
      return false;
    }
    if (selectedActivities.length === 0) {
      alert("Please select at least one activity");
      return false;
    }
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validate()) return;

    const allActivities = getAllActivities();
    
    const formattedActivities = selectedActivities.map((actName, actIndex) => {
      const activityObj = allActivities.find((a) => a.name === actName);
      const dates = activityDates[actName];

      return {
        id: `a${actIndex + 1}_${Date.now()}`,
        name: actName,
        startDate: dates.startDate,
        endDate: dates.endDate,
        progress: 0,
        subActivities: activityObj.subActivities.map((sub, subIndex) => ({
          id: `s${actIndex + 1}_${subIndex + 1}_${Date.now()}`,
          name: sub.name,
          unit: sub.unit,
          plannedQty: sub.unit !== "status" ? (sub.defaultPlanned || 0) : 1,
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

  const closeModal = (setter) => {
    setter(false);
  };

  // Mobile step navigation
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-4 md:space-y-8 px-3 md:px-4 py-4 md:py-6"
      onClick={(e) => e.stopPropagation()}
    >
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
                    <option value="Km">Kilometer (Km) - Track by numbers</option>
                    <option value="Nos.">Numbers (Nos.) - Track by count</option>
                    <option value="Percentage">Percentage (%) - Track by percentage</option>
                    <option value="status">Status Based - Track by status</option>
                  </select>
                  
                  {newSubActivity.unit !== "status" ? (
                    <input
                      type="number"
                      placeholder="Planned quantity"
                      value={newSubActivity.defaultPlanned}
                      onChange={(e) => setNewSubActivity({...newSubActivity, defaultPlanned: parseFloat(e.target.value)})}
                      className="w-full p-2.5 md:p-3 border rounded-xl text-sm md:text-base"
                      min="0"
                      step="0.01"
                      required
                    />
                  ) : (
                    <div className="p-2.5 md:p-3 bg-blue-50 rounded-xl text-xs md:text-sm text-blue-600 flex items-center gap-2">
                      <Info size={16} />
                      Status-based tracking - No quantity needed
                    </div>
                  )}
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

      {/* ================= FORM SECTION ================= */}
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
                {companies.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
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
                {companies.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
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
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (newSector && !sectors.includes(newSector)) {
                    setSectors([...sectors, newSector]);
                    setNewSector("");
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
                      filteredClients.map((client) => (
                        <div
                          key={client}
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

            <input
              type="text"
              placeholder="Add New Client"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
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
                <Calendar size={12} /> LOA Date
              </label>
              <input
                type="date"
                name="loaDate"
                value={form.loaDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> Completion Date
              </label>
              <input
                type="date"
                name="completionDate"
                value={form.completionDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> Director Proposal
              </label>
              <input
                type="date"
                name="directorProposalDate"
                value={form.directorProposalDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={12} /> Project Confirmation
              </label>
              <input
                type="date"
                name="projectConfirmationDate"
                value={form.projectConfirmationDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
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

          {/* Activity Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            {getAllActivities().map((activity) => {
              const isSelected = selectedActivities.includes(activity.name);
              const isCustom = activity.isCustom;
              
              return (
                <div key={activity.name} className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedActivities(prev => prev.filter((a) => a !== activity.name));
                        setActivityDates(prev => {
                          const newDates = { ...prev };
                          delete newDates[activity.name];
                          return newDates;
                        });
                      } else {
                        setSelectedActivities(prev => [...prev, activity.name]);
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

          {/* Selected Activities with Date Configuration */}
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
                          {isCustom && (
                            <span className="text-[10px] md:text-xs bg-yellow-100 text-yellow-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
                              Custom
                            </span>
                          )}
                          <span className="text-[10px] md:text-xs bg-blue-100 text-blue-600 px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
                            {activityObj?.subActivities.length || 0} sub
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

                            {/* Sub-activities */}
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
                                Add
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 md:gap-2">
                              {activityObj?.subActivities.map((sub) => (
                                <div
                                  key={sub.name}
                                  className="flex items-center justify-between bg-gray-50 p-1.5 md:p-2 rounded-lg border border-gray-100 group"
                                >
                                  <span className="text-xs text-gray-700 truncate max-w-[80px] md:max-w-[100px]">
                                    {sub.name}
                                  </span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                                      {sub.unit === "status" ? "S" : sub.unit === "Km" ? "Km" : sub.unit === "Nos." ? "Nos" : "%"}
                                    </span>
                                    {sub.unit !== "status" && (
                                      <span className="text-[10px] text-gray-400">
                                        {sub.defaultPlanned}
                                      </span>
                                    )}
                                    {isCustom && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubActivity(actName, sub.name)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X size={10} className="text-red-500" />
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