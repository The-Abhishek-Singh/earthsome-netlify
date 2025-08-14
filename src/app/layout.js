import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./Providers";
import NavbarFooterWrapper from "@/Components/NavbarFooterWrapper";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: "Earthsome",
  description: "Your app description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <NavbarFooterWrapper>
            {children}
          </NavbarFooterWrapper>
        </Providers>
      </body>
    </html>
  );
}
