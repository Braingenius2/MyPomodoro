import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Pomodoro",
  description: "A super pomodoro app for productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg font-mono text-text-primary antialiased">
        <main className="w-full min-h-screen flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
