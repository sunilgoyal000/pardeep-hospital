// Mock data for doctors
export const doctors = [
  {
    id: "dr-sharma",
    name: "Dr. Rajesh Sharma",
    specialization: "Cardiologist",
    experience: 15,
    patients: 4200,
    rating: 4.9,
    available: true,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    fee: 500,
    about:
      "Dr. Rajesh Sharma is a highly experienced cardiologist with over 15 years of expertise in interventional cardiology, echocardiography, and preventive cardiac care. He has performed over 3,000 cardiac procedures and is known for his patient-centric approach.",
    qualifications: ["MBBS — AIIMS Delhi", "MD (Cardiology) — PGI Chandigarh", "DM (Cardiology) — SGPGI Lucknow"],
    schedule: [
      { day: "Mon", slots: ["9:00 AM", "9:30 AM", "11:00 AM", "11:30 AM", "3:00 PM", "4:00 PM"] },
      { day: "Wed", slots: ["9:00 AM", "10:00 AM", "11:30 AM", "3:00 PM", "4:30 PM"] },
      { day: "Fri", slots: ["9:00 AM", "9:30 AM", "11:00 AM", "2:00 PM", "3:30 PM"] },
    ],
  },
  {
    id: "dr-kaur",
    name: "Dr. Gurpreet Kaur",
    specialization: "Orthopedic Surgeon",
    experience: 12,
    patients: 3800,
    rating: 4.8,
    available: true,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    fee: 600,
    about:
      "Dr. Gurpreet Kaur specializes in joint replacement surgeries, sports injuries, and spine care. She has successfully performed over 1,500 joint replacement procedures with an exceptional success rate.",
    qualifications: ["MBBS — GMC Amritsar", "MS (Orthopedics) — PGIMER", "Fellowship in Arthroplasty — UK"],
    schedule: [
      { day: "Tue", slots: ["10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
      { day: "Thu", slots: ["9:00 AM", "10:00 AM", "11:30 AM", "3:00 PM"] },
      { day: "Sat", slots: ["9:00 AM", "9:30 AM", "11:00 AM"] },
    ],
  },
  {
    id: "dr-verma",
    name: "Dr. Anil Verma",
    specialization: "ENT Specialist",
    experience: 10,
    patients: 5100,
    rating: 4.7,
    available: false,
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    fee: 400,
    about:
      "Dr. Anil Verma is an expert in ENT disorders including hearing loss, sinusitis, thyroid disorders, and head-neck surgeries. He has pioneered minimally invasive ENT procedures in the region.",
    qualifications: ["MBBS — KGMU Lucknow", "MS (ENT) — Maulana Azad Medical College", "Fellowship — Mayo Clinic USA"],
    schedule: [
      { day: "Mon", slots: ["9:00 AM", "11:00 AM", "2:00 PM", "3:30 PM"] },
      { day: "Wed", slots: ["9:30 AM", "11:00 AM", "3:00 PM"] },
      { day: "Sat", slots: ["9:00 AM", "10:30 AM"] },
    ],
  },
  {
    id: "dr-mehta",
    name: "Dr. Priya Mehta",
    specialization: "Neurologist",
    experience: 14,
    patients: 2900,
    rating: 4.9,
    available: true,
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    fee: 700,
    about:
      "Dr. Priya Mehta is a leading neurologist specializing in epilepsy, stroke management, movement disorders, and neuro-critical care. She is a pioneer in tele-neurology services in Punjab.",
    qualifications: ["MBBS — CMC Vellore", "MD (Neurology) — NIMHANS Bengaluru", "DM (Neurology) — AIIMS"],
    schedule: [
      { day: "Tue", slots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM"] },
      { day: "Thu", slots: ["9:30 AM", "11:00 AM", "3:00 PM"] },
      { day: "Fri", slots: ["10:00 AM", "11:30 AM"] },
    ],
  },
];
