import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./SmoothScroll";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Distribution Machine — Turn Content Into a System",
  description:
    "Upload once. We automatically reformat, optimize, and publish your video everywhere it matters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} ${playfair.variable} antialiased bg-[#0b0f14] text-[#e8eaf0]`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
