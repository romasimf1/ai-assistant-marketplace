import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Assistant Marketplace - Philadelphia, PA",
  description: "Connect with specialized AI-powered voice assistants for everyday tasks in Philadelphia. Order food, book travel, schedule appointments, and more with conversational AI.",
  keywords: "AI assistants, Philadelphia, voice AI, food ordering, travel booking, healthcare, automotive, local services",
  authors: [{ name: "AI Assistant Marketplace" }],
  creator: "AI Assistant Marketplace",
  publisher: "AI Assistant Marketplace",
  robots: "index, follow",
  openGraph: {
    title: "AI Assistant Marketplace - Philadelphia, PA",
    description: "Connect with specialized AI-powered voice assistants for everyday tasks in Philadelphia.",
    url: "https://ai-assistants-philly.com",
    siteName: "AI Assistant Marketplace",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Assistant Marketplace - Philadelphia, PA",
    description: "Connect with specialized AI-powered voice assistants for everyday tasks in Philadelphia.",
    creator: "@aiassistants",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
