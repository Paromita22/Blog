import type { Metadata } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono, Germania_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});
const germania = Germania_One({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: "400",
});

export const metadata: Metadata = {
  title: "PCJ Blogs",
  description: "A digital space for scattered thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} ${germania.variable} font-body`}
        style={{ backgroundColor: "var(--ink)", color: "var(--paper)", transition: "background-color 0.3s ease, color 0.3s ease" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
