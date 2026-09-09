import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavigationProgress } from "@/components/NavigationProgress";
import { ChatWidget } from "@/components/ChatWidget";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resourcify — Find Your Exact Gap, Fix It Fast",
  description:
    "Resourcify diagnoses your exact conceptual weakness and gives you the smallest possible fix. Built for JEE aspirants who want precision, not more content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

