import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Vibe - Controle Financeiro",
  description: "Aplicativo de controle financeiro pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ConfigProvider
          locale={ptBR}
          theme={{
            token: {
              colorPrimary: "#1677ff",
            },
          }}
        >
          <ClientLayout>
            {children}
          </ClientLayout>
        </ConfigProvider>
      </body>
    </html>
  );
} 