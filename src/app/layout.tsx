import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ConfettiBackground from "@/components/ConfettiBackground";
import Toaster from "@/components/Toaster";
import SoundToggle from "@/components/SoundToggle";
import LiveActivity from "@/components/LiveActivity";
import SpinWheelWidget from "@/components/SpinWheelWidget";
import ChatWidget from "@/components/ChatWidget";
import { auth } from "@/auth";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "JuwaFire — Feel the Rush",
  description:
    "A neon-lit online casino built for energy. Electric slots, live tables, a daily prize wheel and jackpots that light up the night.",
};

export const viewport: Viewport = {
  themeColor: "#05060f", // TEST: revert to #0a0613
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={`${sora.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <ConfettiBackground />
        <Navbar user={session?.user ?? null} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
        <Toaster />
        <SoundToggle />
        <SpinWheelWidget loggedIn={!!session?.user} />
        <ChatWidget loggedIn={!!session?.user} />
        <LiveActivity />
      </body>
    </html>
  );
}
