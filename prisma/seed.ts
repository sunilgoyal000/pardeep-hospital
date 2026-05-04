import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Departments
  const cardiology = await prisma.department.upsert({
    where: { code: "CARD" },
    update: { iconEmoji: "🫀", colorHex: "#fce7f3", beds: 24 },
    create: { name: "Cardiology", code: "CARD", iconEmoji: "🫀", colorHex: "#fce7f3", beds: 24 },
  });
  const ortho = await prisma.department.upsert({
    where: { code: "ORTHO" },
    update: { iconEmoji: "🦴", colorHex: "#ede9fe", beds: 18 },
    create: { name: "Orthopedics", code: "ORTHO", iconEmoji: "🦴", colorHex: "#ede9fe", beds: 18 },
  });
  const neuro = await prisma.department.upsert({
    where: { code: "NEURO" },
    update: { iconEmoji: "🧠", colorHex: "#e0f2fe", beds: 16 },
    create: { name: "Neurology", code: "NEURO", iconEmoji: "🧠", colorHex: "#e0f2fe", beds: 16 },
  });

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@pardeep.local" },
    update: {},
    create: {
      email: "admin@pardeep.local",
      name: "Hospital Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  // Doctor users + Doctor profiles
  const drSharmaUser = await prisma.user.upsert({
    where: { email: "sharma@pardeep.local" },
    update: {},
    create: { email: "sharma@pardeep.local", name: "Dr. Rajesh Sharma", role: "DOCTOR", passwordHash },
  });
  const drMehtaUser = await prisma.user.upsert({
    where: { email: "mehta@pardeep.local" },
    update: {},
    create: { email: "mehta@pardeep.local", name: "Dr. Priya Mehta", role: "DOCTOR", passwordHash },
  });
  const drKaurUser = await prisma.user.upsert({
    where: { email: "kaur@pardeep.local" },
    update: {},
    create: { email: "kaur@pardeep.local", name: "Dr. Gurpreet Kaur", role: "DOCTOR", passwordHash },
  });

  const drSharma = await prisma.doctor.upsert({
    where: { userId: drSharmaUser.id },
    update: { experienceYears: 15, rating: 4.9, imageUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
    create: {
      userId: drSharmaUser.id,
      departmentId: cardiology.id,
      specialty: "Cardiology",
      consultFee: 500,
      experienceYears: 15,
      rating: 4.9,
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  });
  const drMehta = await prisma.doctor.upsert({
    where: { userId: drMehtaUser.id },
    update: { experienceYears: 14, rating: 4.9, imageUrl: "https://randomuser.me/api/portraits/women/28.jpg" },
    create: {
      userId: drMehtaUser.id,
      departmentId: neuro.id,
      specialty: "Neurology",
      consultFee: 700,
      experienceYears: 14,
      rating: 4.9,
      imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    },
  });
  const drKaur = await prisma.doctor.upsert({
    where: { userId: drKaurUser.id },
    update: { experienceYears: 12, rating: 4.8, imageUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
    create: {
      userId: drKaurUser.id,
      departmentId: ortho.id,
      specialty: "Orthopedics",
      consultFee: 600,
      experienceYears: 12,
      rating: 4.8,
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  });

  // Department heads
  await prisma.department.update({ where: { id: cardiology.id }, data: { headDoctorId: drSharma.id } });
  await prisma.department.update({ where: { id: ortho.id },     data: { headDoctorId: drKaur.id   } });
  await prisma.department.update({ where: { id: neuro.id },     data: { headDoctorId: drMehta.id  } });

  // Patient users + Patient profiles
  const patientSeeds = [
    { email: "rahul@example.com",     name: "Rahul Kumar",      phone: "+91 9876543210", dob: "1990-04-12", gender: "MALE" as const,   bloodGroup: "B+"  },
    { email: "gurpreet@example.com",  name: "Gurpreet Kaur",    phone: "+91 8765432109", dob: "1996-09-30", gender: "FEMALE" as const, bloodGroup: "O+"  },
    { email: "harjinder@example.com", name: "Harjinder Singh",  phone: "+91 7654321098", dob: "1972-01-05", gender: "MALE" as const,   bloodGroup: "A+"  },
    { email: "sunita@example.com",    name: "Sunita Mehta",     phone: "+91 6543210987", dob: "1979-07-22", gender: "FEMALE" as const, bloodGroup: "AB+" },
  ];
  const patients: { id: string; userId: string }[] = [];
  for (const p of patientSeeds) {
    const u = await prisma.user.upsert({
      where: { email: p.email },
      update: { phone: p.phone },
      create: { email: p.email, name: p.name, role: "PATIENT", phone: p.phone, passwordHash },
    });
    const pat = await prisma.patient.upsert({
      where: { userId: u.id },
      update: { dob: new Date(p.dob), gender: p.gender, bloodGroup: p.bloodGroup },
      create: {
        userId: u.id,
        dob: new Date(p.dob),
        gender: p.gender,
        bloodGroup: p.bloodGroup,
      },
    });
    patients.push({ id: pat.id, userId: u.id });
  }

  // Appointments — spread across today and the next few days
  const today = new Date();
  today.setMinutes(0, 0, 0);
  const slots: Array<{ doctorId: string; patientId: string; offsetH: number; status: "BOOKED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" }> = [
    { doctorId: drSharma.id, patientId: patients[0].id, offsetH: 2, status: "CONFIRMED" },
    { doctorId: drMehta.id,  patientId: patients[1].id, offsetH: 4, status: "BOOKED" },
    { doctorId: drKaur.id,   patientId: patients[2].id, offsetH: 6, status: "CONFIRMED" },
    { doctorId: drMehta.id,  patientId: patients[3].id, offsetH: 26, status: "BOOKED" },
    { doctorId: drSharma.id, patientId: patients[1].id, offsetH: 28, status: "COMPLETED" },
    { doctorId: drKaur.id,   patientId: patients[0].id, offsetH: 50, status: "CANCELLED" },
  ];

  for (const s of slots) {
    const start = new Date(today.getTime() + s.offsetH * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    await prisma.appointment.upsert({
      where: { doctorId_slotStart: { doctorId: s.doctorId, slotStart: start } },
      update: { status: s.status },
      create: {
        doctorId: s.doctorId,
        patientId: s.patientId,
        slotStart: start,
        slotEnd: end,
        status: s.status,
      },
    });
  }

  console.log("Seed complete.");
  console.log("Login:  admin@pardeep.local / password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
