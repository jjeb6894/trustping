import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://verticified.com"),
  title: "TrustLink — Get trusted. Get certified.",
  description:
    "TrustLink is building a trust-check platform for marketplace listings and profiles. This prototype uses simulated results; listings are not verified and no insurance coverage is provided.",
  openGraph: {
    title: "TrustLink — Get trusted. Get certified.",
    description:
      "Explore the TrustLink prototype. Results are simulated; listings are not verified and no insurance coverage is provided.",
    url: "https://verticified.com/",
    siteName: "TrustLink",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <aside
          role="status"
          className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-950"
        >
          Prototype: results are simulated. Listings are not verified; no insurance, claims,
          human reviews, or payments are available.
        </aside>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
