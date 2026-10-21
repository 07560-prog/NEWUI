import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIBE UI - Interactive Web UI Artifacts & Code Repository",
  description: "An authentic early-2000s web personal homepage aesthetic UI repository. Featuring live HTML/CSS/JS sandbox, rating, BBS comments, and creative code snippets.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
