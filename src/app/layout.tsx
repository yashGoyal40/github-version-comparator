import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Version Comparator",
  description: "Compare any GitHub repository versions with beautiful diffs, commit history, and file changes. Client-side only with Docker & Kubernetes support.",
  keywords: ["github", "version-comparison", "diff", "git", "docker", "kubernetes", "nextjs", "typescript"],
  authors: [{ name: "yashGoyal40" }],
  creator: "yashGoyal40",
  openGraph: {
    title: "GitHub Version Comparator",
    description: "Compare any GitHub repository versions with beautiful diffs, commit history, and file changes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Version Comparator",
    description: "Compare any GitHub repository versions with beautiful diffs, commit history, and file changes.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
