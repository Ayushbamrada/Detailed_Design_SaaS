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
  Save,
  Info
} from "lucide-react";

const MASTER_ACTIVITIES = [
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
  const [Clients, setClients] = useState([
"A S Traders",
"AGIPL",
"Ajay Parkash",
"AMAG",
"Ambar Infra",
"Ambay Infra",
"Amit Chopra",
"Apco",
"Arcons",
"Arnac",
"Barbrik",
"BCC",
"Beigh Construction",
"Bharat",
"BI",
"BNA",
"BRO",
"BRS",
"CDS",
"Ceigall",
"Chaudhary Construction",
"Chopra/Shreya",
"Ciegall",
"Classic Infra",
"Classic Infra / Neeraj Agarwal",
"CS Construction",
"DCC",
"Devyash",
"Devyash/Digvijay",
"Dhar Construction",
"Dhariwal",
"Dhariwal/MRG",
"DHD",
"Dhingra Brothers",
"DMR",
"DPS",
"DRA",
"Dynasty Promoters",
"Ganesh Builders",
"Ganesh Garia",
"Garg Sons",
"Gaurav Aehlawat",
"Gawar",
"GE",
"Geetech",
"GHV",
"Giriraj Construction",
"Griffin",
"GRTC",
"GSC",
"HG Infra",
"Hillways",
"HP Madhukar",
"Imtiaz",
"ISC",
"Jandu",
"Kaluwala",
"Kamal Contractor",
"KCC",
"KCVR",
"Keystone",
"KG Gupta",
"KRC",
"Krishna Projects",
"Mahavir Gupta & sons (RKC)",
"Mahavir Sharma / Sumit Singh",
"Mann Builders",
"MCL",
"Mosh Vari",
"MRG",
"MSC",
"MSC HP",
"Nadbindu",
"Nagyan",
"Neeraj Cements",
"NKG",
"NU",
"Oasis",
"Pankaj Kumar Goel",
"Pappu prasad",
"Peto Dumpum",
"PNC",
"PRA",
"Preeti Buildcon",
"Preeti Buildicon",
"PS Construction",
"R&C",
"Rahil Wazir",
"Raj Corporation",
"Rajender singh",
"Rajindra Construction",
"Rajpath",
"Ravi Infra",
"RCC",
"Reliance",
"RIPL",
"RKC",
"RL & Sons",
"SAC",
"SAC-RIPL",
"Sadbhav",
"Sarvodya Infra",
"Satish AG",
"SCPL",
"SGI",
"Sharma Construction",
"Shri Mohangarh Const. Co.",
"Singla",
"Singla Construction",
"SKS Infra",
"Skylark",
"SMS Ltd",
"Snal Infra",
"SPL",
"SRC-MSA JV",
"SRM",
"SS Builders",
"SS Builders/A Square",
"Subash Agarwal",
"Sunmaya",
"Sunny Infra",
"Sunny Infra Projects Pvt Ltd",
"Tejwant rai",
"Terrain Infra",
"TMAP",
"Topden Puning",
"Tumas",
"Uma Construction",
"V&H",
"Vindhya Company",
"Vindhya Construction",
"Vishwakarma Enterprises",
"VRC",
"Notch"
]);
  const [newSector, setNewSector] = useState("");
  const [newClient, setNewClient] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [activityDates, setActivityDates] = useState({});
  
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

    // For status-based units, defaultPlanned is not needed
    if (newSubActivity.unit !== "status" && (!newSubActivity.defaultPlanned || newSubActivity.defaultPlanned <= 0)) {
      alert("Please enter planned quantity");
      return;
    }

    setCustomActivities(prev => prev.map(act => {
      if (act.name === selectedActivityForSub) {
        return {
          ...act,
          subActivities: [
            ...act.subActivities,
            { 
              name: newSubActivity.name, 
              unit: newSubActivity.unit, 
              defaultPlanned: newSubActivity.unit !== "status" ? parseFloat(newSubActivity.defaultPlanned) : 1
            }
          ]
        };
      }
      return act;
    }));

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
  };

  const getAllActivities = () => {
    return [...MASTER_ACTIVITIES, ...customActivities];
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 px-4 py-6"
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
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAddActivity}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Add New Activity</h3>
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
                  className="w-full p-3 border rounded-xl mb-4"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => closeModal(setShowAddActivityModal)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAddSubActivity}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Add Sub-Activity to {selectedActivityForSub}</h3>
                  <button
                    type="button"
                    onClick={() => closeModal(setShowAddSubActivityModal)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
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
                    required
                  />
                  
                  <select
                    value={newSubActivity.unit}
                    onChange={(e) => setNewSubActivity({...newSubActivity, unit: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="Km">Kilometer (Km) - Track by numbers</option>
                    <option value="Nos.">Numbers (Nos.) - Track by count</option>
                    <option value="Percentage">Percentage (%) - Track by percentage</option>
                    <option value="status">Status Based - Track by status (Pending/Ongoing/Completed/Delayed/Hold)</option>
                  </select>
                  
                  {newSubActivity.unit !== "status" ? (
                    <input
                      type="number"
                      placeholder="Planned quantity"
                      value={newSubActivity.defaultPlanned}
                      onChange={(e) => setNewSubActivity({...newSubActivity, defaultPlanned: parseFloat(e.target.value)})}
                      className="w-full p-3 border rounded-xl"
                      min="0"
                      step="0.01"
                      required
                    />
                  ) : (
                    <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-600 flex items-center gap-2">
                      <Info size={16} />
                      Status-based tracking - No quantity needed. Will track as Pending, Ongoing, Completed, etc.
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => closeModal(setShowAddSubActivityModal)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Sub-Activity
                  </button>
                </div>
              </form>
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
      <form onSubmit={handleSubmit} className="space-y-8">
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
              { label: "Project Code *", name: "code", icon: "📋", type: "text" },
              { label: "Project Name *", name: "name", icon: "🏗️", type: "text" },
              { label: "Short Name *", name: "shortName", icon: "🔤", type: "text" },
              { label: "Location", name: "location", icon: "📍", type: "text" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <span className="absolute left-3 top-3 text-lg">{field.icon}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            ))}

            {/* Company Selection */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-lg">🏢</span>
              <select
                name="company"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
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

            {/* Sub Company Dropdown */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-lg">🏭</span>
              <select
                name="subCompany"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
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

            {/* Sector with Add Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-3 text-lg">📊</span>
                <select
                  name="sector"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
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
                className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus size={18} />
              </button>
            </div>

            <input
              type="text"
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
                  name="department"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white appearance-none"
                  onChange={handleChange}
                  value={form.department}
                >
                  <option value="">Select Client</option>
                  {Clients.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (newClient && !Clients.includes(newClient)) {
                    setClients([...Clients, newClient]);
                    setNewClient ("");
                  }
                }}
                className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Add New Client"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
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
                name="totalLength"
                step="0.01"
                placeholder="Total Length"
                value={form.totalLength}
                onChange={handleChange}
                className="w-full pl-10 pr-16 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <span className="absolute right-4 top-3 text-gray-500 text-sm font-medium">km</span>
            </div>

            {/* Workorder Cost */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-lg">💰</span>
              <input
                type="number"
                name="cost"
                placeholder="Workorder Cost"
                value={form.cost}
                onChange={handleChange}
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
                name="loaDate"
                value={form.loaDate}
                onChange={handleChange}
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
                name="completionDate"
                value={form.completionDate}
                onChange={handleChange}
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
                name="directorProposalDate"
                value={form.directorProposalDate}
                onChange={handleChange}
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
                name="projectConfirmationDate"
                value={form.projectConfirmationDate}
                onChange={handleChange}
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
            
            <button
              type="button"
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
                  
                  {isCustom && (
                    <button
                      type="button"
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
                  
                  {isSelected && (
                    <button
                      type="button"
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
                                type="button"
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
                                      {sub.unit === "status" ? "Status" : sub.unit}
                                    </span>
                                    {sub.unit !== "status" && (
                                      <span className="text-xs text-gray-400">
                                        {sub.defaultPlanned} {sub.unit}
                                      </span>
                                    )}
                                    {activityObj.isCustom && (
                                      <button
                                        type="button"
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
                type="button"
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
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-16 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 font-bold text-xl flex items-center gap-3"
          >
            <CheckCircle size={24} />
            Create Project
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateProject;