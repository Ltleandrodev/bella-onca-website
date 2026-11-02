import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bella Onça | Cílios e Sobrancelhas",
  description: "Bella Onça Studio — cílios, sobrancelhas, modelos, valores e agendamento."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
