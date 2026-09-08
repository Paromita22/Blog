import type { Metadata } from "next";
import { IBM_Plex_Mono, Cinzel, Great_Vibes, Cormorant_Garamond, Germania_One, Lora, IM_Fell_English } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400"],
});

const germania = Germania_One({
  subsets: ["latin"],
  variable: "--font-logo",
  weight: "400",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-reading",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const imFell = IM_Fell_English({
  subsets: ["latin"],
  variable: "--font-vintage",
  weight: "400",
  style: ["normal", "italic"],
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
        className={`${cinzel.variable} ${cormorant.variable} ${plexMono.variable} ${greatVibes.variable} ${germania.variable} ${lora.variable} ${imFell.variable} font-body`}
        style={{ backgroundColor: "var(--ink)", color: "var(--paper)", transition: "background-color 0.3s ease, color 0.3s ease" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
