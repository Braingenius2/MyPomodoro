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
    <html lang="en" className="h-full">
      <body className="h-full bg-dark-bg font-mono text-text-primary antialiased">
        <main className="h-full flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
