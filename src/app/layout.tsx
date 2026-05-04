import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/Componenst/Header"; // Import Header
import Footer from "@/Componenst/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bengkel Las Cv Bina  Karya - Solusi Pagar & Kanopi",
  description: "Penjualan produk bengkel las berkualitas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header /> {/* Letakkan di sini agar muncul di atas semua halaman */}
        {children}
        <Footer />
      </body>
    </html>
  );
}