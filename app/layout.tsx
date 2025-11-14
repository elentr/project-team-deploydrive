import type { Metadata } from "next";
import { Nunito_Sans, Sora } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TravellersPage from "@/components/TravellersPage/TravellersPage";

const nunito = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "cyrillic"],
});

const sora = Sora({
  variable: "--font-sora-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Подорожники",
  description: "Надихніться подорожами інших та поділіться своєю історією.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${sora.variable}`}>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <TravellersPage />
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
