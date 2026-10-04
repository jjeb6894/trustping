import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "TrustPing — Trust Score for any listing or profile",
  description:
    "Explore the TrustPing prototype. Trust scores are simulated; no listings are verified and no insurance coverage is provided.",
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
