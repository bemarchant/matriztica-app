import "./globals.css";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Matríztica App",
  description: "Registro sereno de emociones–sentires–haceres",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
