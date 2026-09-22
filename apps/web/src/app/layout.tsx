import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KPMG Performance Command Center",
  description: "A private planning and KBAC study system for a Technology Risk Analyst.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg font-mono text-text-primary antialiased">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
