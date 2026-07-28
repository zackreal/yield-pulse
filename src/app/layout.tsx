import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YieldPulse Enterprise",
  description: "Autonomous Dynamic Pricing & Demand Intelligence System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans selection:bg-indigo-500/20">
        <div className="flex flex-col min-h-screen relative">
          <Navigation />
          
          <main className="flex-1 flex flex-col relative z-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}