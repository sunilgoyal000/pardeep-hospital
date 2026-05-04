import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Departments
  const cardiology = await prisma.department.upsert({
    where: { code: "CARD" },
    update: {},
    create: { name: "Cardiology", code: "CARD" },
  });
  const ortho = await prisma.department.upsert({
    where: { code: "ORTHO" },
    update: {},
    create: { name: "Orthopedics", code: "ORTHO" },
  });
  const neuro = await prisma.department.upsert({
    where: { code: "NEURO" },
    update: {},
    create: { name: "Neurology", code: "NEURO" },
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
    update: {},
    create: {
      userId: drSharmaUser.id,
      departmentId: cardiology.id,
      specialty: "Cardiology",
      consultFee: 500,
    },
  });
  const drMehta = await prisma.doctor.upsert({
    where: { userId: drMehtaUser.id },
    update: {},
    create: {
      userId: drMehtaUser.id,
      departmentId: neuro.id,
      specialty: "Neurology",
      consultFee: 700,
    },
  });
  const drKaur = await prisma.doctor.upsert({
    where: { userId: drKaurUser.id },
    update: {},
    create: {
      userId: drKaurUser.id,
      departmentId: ortho.id,
      specialty: "Orthopedics",
      consultFee: 600,
    },
  });

  // Patient users + Patient profiles
  const patientSeeds = [
    { email: "rahul@example.com", name: "Rahul Kumar" },
    { email: "gurpreet@example.com", name: "Gurpreet Kaur" },
    { email: "harjinder@example.com", name: "Harjinder Singh" },
    { email: "sunita@example.com", name: "Sunita Mehta" },
  ];
  const patients: { id: string; userId: string }[] = [];
  for (const p of patientSeeds) {
    const u = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { email: p.email, name: p.name, role: "PATIENT", passwordHash },
    });
    const pat = await prisma.patient.upsert({
      where: { userId: u.id },
      update: {},
      create: { userId: u.id },
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
