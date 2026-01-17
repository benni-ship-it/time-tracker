import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BS Time Tracker",
  description: "Erfasse deine Arbeitszeiten und behalte den Überblick",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} antialiased bg-[#fdf6ef]`}>
        <nav className="bg-[#f5d6ba]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-[#1e1b4b]">Time Tracker</span>
                </Link>
                <div className="ml-8 flex space-x-2">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1e1b4b]/70 hover:text-[#1e1b4b] hover:bg-[#1e1b4b]/10 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/time"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1e1b4b]/70 hover:text-[#1e1b4b] hover:bg-[#1e1b4b]/10 rounded-lg transition-colors"
                  >
                    Zeiten
                  </Link>
                  <Link
                    href="/clients"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1e1b4b]/70 hover:text-[#1e1b4b] hover:bg-[#1e1b4b]/10 rounded-lg transition-colors"
                  >
                    Kunden
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
