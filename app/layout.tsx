import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Grand_Hotel } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const grandHotel = Grand_Hotel({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Catalyst — A community where women who build belong, learn & grow",
  description:
    "Catalyst is a community for women across every field — software, electronics, civil, mechanical, design and beyond. Find your people, sharpen your craft, and build. Join Git With Her.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${grandHotel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
