import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Blondage & Co | Hair Salon Hamilton | Home-based Hair Studio Rototuna",
  description:
    "Blondage & Co is a warm, home-based hair studio in Rototuna, Hamilton NZ. Specialising in modern blondes, balayage, lived-in colour, and effortless cuts. Book your appointment today.",
  keywords: [
    "hair salon Hamilton",
    "hairdresser Rototuna",
    "blonde hair specialist Hamilton NZ",
    "balayage Hamilton",
    "home based hair studio Waikato",
    "home based hair studio in Hamilton",
    "home based hair studio near me",
    "hair colour Rototuna",
  ],
  openGraph: {
    title: "Blondage & Co | Hair Salon Hamilton",
    description:
      "Home-based hair studio in Rototuna, Hamilton NZ. Specialising in blondes, balayage and effortless cuts.",
    locale: "en_NZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
