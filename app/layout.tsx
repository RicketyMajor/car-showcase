import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/components";

// One variable family does the whole brand: its width axis gives the expanded
// capitals a maker's site sets its labels and figures in, and the normal width
// reads as body text. Self-hosted by next/font, so no request leaves the site.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

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
    <html lang="en" data-scroll-behavior="smooth" className={`${archivo.variable} h-full antialiased scroll-smooth`}>
      <body className="relative">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
