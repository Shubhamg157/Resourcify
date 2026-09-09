import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Newsreader, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { NavigationProgress } from "@/components/NavigationProgress";
import { ChatWidget } from "@/components/ChatWidget";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GapZero — Find Your Exact Gap, Fix It Fast",
  description:
    "GapZero diagnoses your exact conceptual weakness and gives you the smallest possible fix. Built for JEE aspirants who want precision, not more content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${caveat.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-screen border-t-4 border-brutalBlack selection:bg-schoolYellow selection:text-brutalBlack flex flex-col antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

