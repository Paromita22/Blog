"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import FloatingPaper from "./FloatingPaper";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="relative min-h-screen bg-[var(--ink)] text-[var(--paper)] overflow-hidden">
        <FloatingPaper />
        <div className="relative z-10 pt-32 pb-24">{children}</div>
      </main>
      <Footer />
    </>
  );
}
