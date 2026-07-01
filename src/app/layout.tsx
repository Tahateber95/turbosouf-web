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
    default: "TurboSouf — Pièces Auto Reconditionnées",
    template: "%s | TurboSouf",
  },
  description:
    "Spécialiste en pièces automobiles reconditionnées : turbos, injecteurs, pompes HP. Garantie 2 ans, livraison 24-48h, paiement 3x/4x sans frais.",
  keywords: [
    "turbo reconditionné",
    "injecteur reconditionné",
    "pompe HP",
    "pièces auto",
    "échange standard",
    "turbocompresseur",
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
