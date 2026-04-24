import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { doctors } from "@/data/doctors";
import DoctorProfile from "@/components/doctor/DoctorProfile";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return doctors.map((doc) => ({ id: doc.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doc = doctors.find((d) => d.id === id);
  if (!doc) return { title: "Doctor Not Found" };
  return {
    title: `${doc.name} — ${doc.specialization}`,
    description: doc.about,
  };
}

export default async function DoctorPage({ params }: Props) {
  const { id } = await params;
  const doc = doctors.find((d) => d.id === id);
  if (!doc) notFound();
  return <DoctorProfile doctor={doc} />;
}
