import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pardeep Hospital — Smart Healthcare Platform",
    template: "%s | Pardeep Hospital",
  },
  description:
    "Book appointments, track queue status, find doctors, and manage your healthcare journey at Pardeep Hospital — your trusted multi-specialty healthcare partner.",
  keywords: [
    "Pardeep Hospital",
    "hospital appointment",
    "doctor booking",
    "queue management",
    "healthcare platform",
    "orthopedic",
    "cardiology",
    "ENT",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Pardeep Hospital",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
