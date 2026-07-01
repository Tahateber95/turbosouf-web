import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TurboSouf — Turbos Reconditionnés",
    template: "%s | TurboSouf",
  },
  description:
    "Spécialiste en turbos reconditionnés. Garantie 2 ans, livraison 24-48h, paiement 3x/4x sans frais.",
  keywords: [
    "turbo reconditionné",
    "turbocompresseur",
    "échange standard",
    "turbo diesel",
    "turbo essence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
