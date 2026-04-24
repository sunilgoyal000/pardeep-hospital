// ── Admin Mock Data ──────────────────────────────────────────
// All data used across the admin dashboard modules

export const kpiData = {
  totalPatients: 12847,
  activeQueues: 34,
  appointmentsToday: 128,
  revenueToday: 284500,
  patientGrowth: 12.4,
  queueGrowth: -3.2,
  appointmentGrowth: 8.7,
  revenueGrowth: 22.1,
};

export const weeklyPatients = [
  { day: "Mon", patients: 98, appointments: 72 },
  { day: "Tue", patients: 134, appointments: 89 },
  { day: "Wed", patients: 112, appointments: 94 },
  { day: "Thu", patients: 156, appointments: 118 },
  { day: "Fri", patients: 143, appointments: 108 },
  { day: "Sat", patients: 187, appointments: 142 },
  { day: "Sun", patients: 67, appointments: 48 },
];

export const deptStats = [
  { name: "Cardiology", patients: 234, color: "#ec4899", pct: 82 },
  { name: "Orthopedics", patients: 198, color: "#8b5cf6", pct: 69 },
  { name: "ENT", patients: 167, color: "#f59e0b", pct: 58 },
  { name: "Neurology", patients: 145, color: "#0891b2", pct: 51 },
  { name: "Pediatrics", patients: 121, color: "#22c55e", pct: 42 },
  { name: "Gynecology", patients: 112, color: "#f43f5e", pct: 39 },
];

export const recentActivity = [
  { id: 1, type: "appointment", msg: "New appointment booked — Dr. Sharma (Rahul K.)", time: "2 min ago", status: "new" },
  { id: 2, type: "queue", msg: "Token PH-047 called — Cardiology OPD", time: "5 min ago", status: "active" },
  { id: 3, type: "patient", msg: "New patient registered — Gurpreet Singh (PH-12848)", time: "12 min ago", status: "new" },
  { id: 4, type: "appointment", msg: "Appointment cancelled — Dr. Mehta (Priya R.)", time: "18 min ago", status: "cancelled" },
  { id: 5, type: "queue", msg: "Pharmacy queue cleared — 14 tokens processed", time: "24 min ago", status: "done" },
  { id: 6, type: "doctor", msg: "Dr. Kaur marked unavailable — Orthopedics", time: "31 min ago", status: "warning" },
  { id: 7, type: "patient", msg: "Discharge completed — Amit Verma (Bed 12-B)", time: "45 min ago", status: "done" },
];

export const patients = [
  { id: "PH-12847", name: "Rahul Kumar", age: 34, gender: "Male", phone: "+91 98765 43210", dept: "Cardiology", doctor: "Dr. Sharma", lastVisit: "2026-04-24", status: "Active", bloodGroup: "B+", appointments: 6 },
  { id: "PH-12846", name: "Gurpreet Kaur", age: 28, gender: "Female", phone: "+91 87654 32109", dept: "Gynecology", doctor: "Dr. Mehta", lastVisit: "2026-04-23", status: "Active", bloodGroup: "O+", appointments: 3 },
  { id: "PH-12845", name: "Harjinder Singh", age: 52, gender: "Male", phone: "+91 76543 21098", dept: "Orthopedics", doctor: "Dr. Kaur", lastVisit: "2026-04-22", status: "Inactive", bloodGroup: "A+", appointments: 12 },
  { id: "PH-12844", name: "Sunita Mehta", age: 45, gender: "Female", phone: "+91 65432 10987", dept: "Neurology", doctor: "Dr. Priya Mehta", lastVisit: "2026-04-21", status: "Active", bloodGroup: "AB+", appointments: 8 },
  { id: "PH-12843", name: "Vikram Rao", age: 61, gender: "Male", phone: "+91 54321 09876", dept: "Cardiology", doctor: "Dr. Sharma", lastVisit: "2026-04-20", status: "Critical", bloodGroup: "B-", appointments: 21 },
  { id: "PH-12842", name: "Anita Patel", age: 39, gender: "Female", phone: "+91 43210 98765", dept: "ENT", doctor: "Dr. Verma", lastVisit: "2026-04-19", status: "Active", bloodGroup: "O-", appointments: 4 },
  { id: "PH-12841", name: "Ranjit Sandhu", age: 57, gender: "Male", phone: "+91 32109 87654", dept: "Orthopedics", doctor: "Dr. Kaur", lastVisit: "2026-04-18", status: "Active", bloodGroup: "A-", appointments: 9 },
  { id: "PH-12840", name: "Pooja Sharma", age: 25, gender: "Female", phone: "+91 21098 76543", dept: "Pediatrics", doctor: "Dr. Arora", lastVisit: "2026-04-17", status: "Inactive", bloodGroup: "B+", appointments: 2 },
];

export const adminDoctors = [
  { id: "D-001", name: "Dr. Rajesh Sharma", dept: "Cardiology", experience: 15, patients: 4200, rating: 4.9, status: "Active", appointments: 128, available: true, image: "https://randomuser.me/api/portraits/men/32.jpg", fee: 500 },
  { id: "D-002", name: "Dr. Gurpreet Kaur", dept: "Orthopedics", experience: 12, patients: 3800, rating: 4.8, status: "Active", appointments: 98, available: true, image: "https://randomuser.me/api/portraits/women/44.jpg", fee: 600 },
  { id: "D-003", name: "Dr. Anil Verma", dept: "ENT", experience: 10, patients: 5100, rating: 4.7, status: "Leave", appointments: 0, available: false, image: "https://randomuser.me/api/portraits/men/56.jpg", fee: 400 },
  { id: "D-004", name: "Dr. Priya Mehta", dept: "Neurology", experience: 14, patients: 2900, rating: 4.9, status: "Active", appointments: 64, available: true, image: "https://randomuser.me/api/portraits/women/28.jpg", fee: 700 },
  { id: "D-005", name: "Dr. Sunil Arora", dept: "Pediatrics", experience: 8, patients: 3200, rating: 4.6, status: "Active", appointments: 112, available: true, image: "https://randomuser.me/api/portraits/men/71.jpg", fee: 350 },
];

export const appointments = [
  { id: "APT-1042", patient: "Rahul Kumar", doctor: "Dr. Sharma", dept: "Cardiology", date: "2026-04-24", time: "3:30 PM", status: "Confirmed", token: "PH-047" },
  { id: "APT-1041", patient: "Gurpreet Kaur", doctor: "Dr. Mehta", dept: "Neurology", date: "2026-04-24", time: "2:00 PM", status: "Completed", token: "PH-031" },
  { id: "APT-1040", patient: "Harjinder Singh", doctor: "Dr. G. Kaur", dept: "Orthopedics", date: "2026-04-24", time: "11:30 AM", status: "Completed", token: "PH-022" },
  { id: "APT-1039", patient: "Sunita Mehta", doctor: "Dr. Mehta", dept: "Neurology", date: "2026-04-24", time: "10:00 AM", status: "Cancelled", token: "PH-015" },
  { id: "APT-1038", patient: "Vikram Rao", doctor: "Dr. Sharma", dept: "Cardiology", date: "2026-04-25", time: "9:30 AM", status: "Pending", token: "PH-003" },
  { id: "APT-1037", patient: "Anita Patel", doctor: "Dr. Verma", dept: "ENT", date: "2026-04-25", time: "11:00 AM", status: "Pending", token: "PH-008" },
  { id: "APT-1036", patient: "Ranjit Sandhu", doctor: "Dr. G. Kaur", dept: "Orthopedics", date: "2026-04-25", time: "2:30 PM", status: "Confirmed", token: "PH-019" },
];

export const liveQueues = [
  {
    dept: "Cardiology",
    doctor: "Dr. Rajesh Sharma",
    total: 18,
    current: 12,
    waiting: 6,
    avgWait: 22,
    color: "#ec4899",
    tokens: [
      { no: "PH-042", name: "R. Kumar", status: "in-room" },
      { no: "PH-043", name: "P. Devi", status: "called" },
      { no: "PH-044", name: "H. Singh", status: "waiting" },
      { no: "PH-045", name: "S. Mehta", status: "waiting" },
    ],
  },
  {
    dept: "Orthopedics",
    doctor: "Dr. Gurpreet Kaur",
    total: 14,
    current: 9,
    waiting: 5,
    avgWait: 18,
    color: "#8b5cf6",
    tokens: [
      { no: "PH-031", name: "V. Rao", status: "in-room" },
      { no: "PH-032", name: "A. Patel", status: "called" },
      { no: "PH-033", name: "R. Sandhu", status: "waiting" },
    ],
  },
  {
    dept: "Neurology",
    doctor: "Dr. Priya Mehta",
    total: 11,
    current: 7,
    waiting: 4,
    avgWait: 15,
    color: "#0891b2",
    tokens: [
      { no: "PH-021", name: "G. Kaur", status: "in-room" },
      { no: "PH-022", name: "N. Singh", status: "waiting" },
    ],
  },
  {
    dept: "Pharmacy",
    doctor: "Pharmacist on duty",
    total: 24,
    current: 19,
    waiting: 5,
    avgWait: 8,
    color: "#22c55e",
    tokens: [
      { no: "RX-041", name: "K. Sharma", status: "in-room" },
      { no: "RX-042", name: "M. Singh", status: "called" },
      { no: "RX-043", name: "P. Kumar", status: "waiting" },
      { no: "RX-044", name: "B. Kaur", status: "waiting" },
      { no: "RX-045", name: "T. Rao", status: "waiting" },
    ],
  },
];

export const notifications = [
  { id: 1, type: "appointment", title: "New Appointment Booked", body: "Rahul Kumar booked with Dr. Sharma at 3:30 PM", time: "2 min ago", read: false },
  { id: 2, type: "queue", title: "Queue Alert", body: "Cardiology queue exceeds 15 — consider opening Room 2", time: "8 min ago", read: false },
  { id: 3, type: "doctor", title: "Doctor Unavailable", body: "Dr. Anil Verma marked as on leave for tomorrow", time: "15 min ago", read: false },
  { id: 4, type: "pharmacy", title: "Pharmacy Queue Full", body: "Pharmacy queue has 24 tokens — peak load", time: "22 min ago", read: true },
  { id: 5, type: "patient", title: "Critical Patient Alert", body: "Vikram Rao (PH-12843) flagged critical — Cardiology", time: "34 min ago", read: true },
  { id: 6, type: "system", title: "Daily Report Ready", body: "April 24 report is available for download", time: "1 hr ago", read: true },
];

export const adminUsers = [
  { id: "U-001", name: "Dr. Sunil Gupta", email: "sunil@pardeephospital.com", role: "Super Admin", dept: "All", status: "Active", lastLogin: "2026-04-24 08:15" },
  { id: "U-002", name: "Harpreet Singh", email: "harpreet@pardeephospital.com", role: "Admin", dept: "OPD", status: "Active", lastLogin: "2026-04-24 09:02" },
  { id: "U-003", name: "Simran Kaur", email: "simran@pardeephospital.com", role: "Receptionist", dept: "Front Desk", status: "Active", lastLogin: "2026-04-24 08:45" },
  { id: "U-004", name: "Manpreet Gill", email: "manpreet@pardeephospital.com", role: "Staff", dept: "Pharmacy", status: "Inactive", lastLogin: "2026-04-20 14:30" },
  { id: "U-005", name: "Rajinder Kumar", email: "rajinder@pardeephospital.com", role: "Receptionist", dept: "Emergency", status: "Active", lastLogin: "2026-04-24 07:55" },
];

export const adminDepartments = [
  { id: "DEPT-01", name: "Cardiology", head: "Dr. Rajesh Sharma", doctors: 5, beds: 24, occupancy: 82, status: "Active", icon: "🫀", color: "#fce7f3" },
  { id: "DEPT-02", name: "Orthopedics", head: "Dr. Gurpreet Kaur", doctors: 4, beds: 18, occupancy: 67, status: "Active", icon: "🦴", color: "#ede9fe" },
  { id: "DEPT-03", name: "ENT", head: "Dr. Anil Verma", doctors: 3, beds: 12, occupancy: 50, status: "Active", icon: "👂", color: "#fef3c7" },
  { id: "DEPT-04", name: "Neurology", head: "Dr. Priya Mehta", doctors: 3, beds: 16, occupancy: 75, status: "Active", icon: "🧠", color: "#e0f2fe" },
  { id: "DEPT-05", name: "Pediatrics", head: "Dr. Sunil Arora", doctors: 3, beds: 20, occupancy: 60, status: "Active", icon: "👶", color: "#dcfce7" },
  { id: "DEPT-06", name: "Emergency", head: "Dr. Karan Bhatia", doctors: 8, beds: 30, occupancy: 90, status: "Critical", icon: "🚑", color: "#fee2e2" },
];

export const prescriptions = [
  { id: "RX-041", patient: "Rahul Kumar", doctor: "Dr. Sharma", medicines: ["Amlodipine 5mg", "Atorvastatin 20mg"], date: "2026-04-24", status: "Dispensed" },
  { id: "RX-042", patient: "Gurpreet Kaur", doctor: "Dr. Mehta", medicines: ["Levothyroxine 50mcg"], date: "2026-04-24", status: "Pending" },
  { id: "RX-043", patient: "Harjinder Singh", doctor: "Dr. G. Kaur", medicines: ["Diclofenac 50mg", "Pantoprazole 40mg", "Calcium 500mg"], date: "2026-04-24", status: "Pending" },
  { id: "RX-044", patient: "Sunita Mehta", doctor: "Dr. P. Mehta", medicines: ["Gabapentin 300mg", "Amitriptyline 10mg"], date: "2026-04-23", status: "Dispensed" },
  { id: "RX-045", patient: "Vikram Rao", doctor: "Dr. Sharma", medicines: ["Bisoprolol 5mg", "Ramipril 10mg", "Aspirin 75mg"], date: "2026-04-23", status: "Dispensed" },
];
