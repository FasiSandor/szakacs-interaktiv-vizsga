import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Szakács Vizsga | Interaktív gyakorló",
  description: "Interaktív szakács vizsgafelkészítő véletlen feladatsorokkal."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="hu"><body>{children}</body></html>;
}