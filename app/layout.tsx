import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Study Planner — Ace Your Goals",
  description: "Track tasks, log study sessions, and crush your academic goals with Study Planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
