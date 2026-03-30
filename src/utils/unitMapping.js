// Map frontend display values to backend enum values
export const UNIT_MAPPING = {
  'Km': 'Kilometer',        // Frontend "Km" → Backend "Kilometer"
  'Nos.': 'Numbers',         // Frontend "Nos." → Backend "Numbers"
  'Percentage': 'Percentage', // Frontend "Percentage" → Backend "Percentage"
  'status': 'Percentage'     // For status-based, we might use "Percentage" or handle separately
};

// Map backend enum values to frontend display values
export const REVERSE_UNIT_MAPPING = {
  'Kilometer': 'Km',
  'Numbers': 'Nos.',
  'Percentage': 'Percentage'
};

// Unit options for dropdowns in UI
export const UNIT_OPTIONS = [
  { value: 'Km', label: 'Kilometer (Km)' },
  { value: 'Nos.', label: 'Numbers (Nos.)' },
  { value: 'Percentage', label: 'Percentage (%)' },
  { value: 'status', label: 'Status Based' }
];

// Status options
export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Inprogress', label: 'In Progress' },
  { value: 'Complete', label: 'Completed' },
  { value: 'OnHold', label: 'On Hold' }
];

// Map frontend status to backend
export const STATUS_MAPPING = {
  'PENDING': 'Pending',
  'ONGOING': 'Inprogress',
  'COMPLETED': 'Complete',
  'HOLD': 'OnHold',
  'DELAYED': 'Inprogress' // Map delayed to inprogress or handle separately
};