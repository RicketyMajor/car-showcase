import type { Metadata } from "next";
import "./globals.css";
import { Footer, Navbar } from "@/components";

export const metadata: Metadata = {
  title: "Milemark — Know what a car really costs",
  description: "Browse and compare cars by manufacturer, model, fuel and year, with real fuel-economy figures.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Smooth in-page jumps ("Explore Cars" -> #discover) come from CSS alone: where
  // a browser or profile has smooth scrolling off, CSS falls back to the instant
  // jump, while scrollIntoView({behavior:"smooth"}) there did nothing at all.
  // `data-scroll-behavior` asks Next 16 to keep route transitions instant.
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased scroll-smooth">
      <body className="relative">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
