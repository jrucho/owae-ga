import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "owae.ga — Music, Visuals & Creative Tools",
  description:
    "The multimedia practice of Carlos Abeijón Martínez: music releases, live visuals, and browser-based creative tools from Lausanne and Galicia.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
