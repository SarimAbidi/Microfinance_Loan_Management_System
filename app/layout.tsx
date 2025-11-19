import React from "react";
import Navbar from "./components/Navbar";
import "./globals.css";


export const metadata = {
  title: "MLMS",
  description: "AI Enhanced Microfinance Loan Management System"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className="min-h-screen">
        <Navbar />
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </body>
    </html>
  );
}
