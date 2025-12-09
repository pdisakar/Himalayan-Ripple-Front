import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Utils/Header/Header";
import Footer from "@/components/Utils/Footer/Footer";
import { fetchGlobalData, fetchHeaderMenu, fetchFooterMenu } from "@/lib/api";

const instrumentSans = Instrument_Sans({
  variable: "--primaryfont",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TravelApp - Explore the World",
  description: "Discover amazing travel packages and destinations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerMenu, footerMenu, globalData] = await Promise.all([
    fetchHeaderMenu().catch(() => []),
    fetchFooterMenu().catch(() => []),
    fetchGlobalData().catch(() => ({}))
  ]);

  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} antialiased`}>
        <Header initialMenu={headerMenu} initialSettings={globalData} />
        {children}
        <Footer initialMenu={footerMenu} initialSettings={globalData} />
      </body>
    </html>
  );
}
