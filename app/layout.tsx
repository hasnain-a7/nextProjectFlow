import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Project Flow - Manage Projects Efficiently",
    template: "%s | Project Flow",
  },
  description:
    "Project Flow helps you streamline your workflow, track projects, and manage tasks efficiently. Organize, prioritize, and achieve more with our intuitive project management platform.",
  keywords: [
    "project management",
    "task management",
    "team collaboration",
    "workflow management",
    "project tracking",
    "productivity",
    "project planner",
    "task organizer",
  ],
  authors: [{ name: "Your Name", url: "https://project.hasnain.site" }],
  icons: {
    icon: "/todo-list-svgrepo-com.svg",
  },
  openGraph: {
    title: "Project Flow - Manage Projects Efficiently",
    description:
      "Streamline your workflow, track projects, and manage tasks efficiently with Project Flow.",
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
    title: "Project Flow - Manage Projects Efficiently",
    description:
      "Streamline your workflow, track projects, and manage tasks efficiently with Project Flow.",
    images: ["/og-image.png"],
    creator: "@YourTwitterHandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://project.hasnain.site"),
  alternates: {
    canonical: "https://project.hasnain.site",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
