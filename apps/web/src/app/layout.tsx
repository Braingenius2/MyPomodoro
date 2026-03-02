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
      <body>{children}</body>
    </html>
  );
}
