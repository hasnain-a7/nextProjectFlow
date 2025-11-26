import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Project Flow - Streamline Your Workflow",
  description:
    "Project Flow helps you manage projects efficiently. Organize tasks, track progress, and collaborate with your team effortlessly.",
  keywords: [
    "project management",
    "task management",
    "team collaboration",
    "workflow management",
    "project tracking",
    "productivity",
  ],
  openGraph: {
    title: "Project Flow - Streamline Your Workflow",
    description:
      "Organize tasks, track progress, and collaborate with your team effortlessly using Project Flow.",
    url: "https://project.hasnain.site",
    siteName: "Project Flow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Project Flow - Project Management App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Flow - Streamline Your Workflow",
    description:
      "Organize tasks, track progress, and collaborate with your team effortlessly using Project Flow.",
    images: ["/og-image.png"],
    creator: "@YourTwitterHandle",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://project.hasnain.site",
  },
};

const LandingPage = () => {
  return (
    <main className="h-full bg-background text-white">
      <Navbar />
      <HeroSection />
    </main>
  );
};

export default LandingPage;
