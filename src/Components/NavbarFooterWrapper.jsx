"use client";

import { usePathname } from "next/navigation";
import Navbar1 from "@/Components/hf.jsx/Navbar1";
import Footer from "@/Components/hf.jsx/Footer";

export default function NavbarFooterWrapper({ children }) {
  const pathname = usePathname();

  // Routes where Navbar & Footer should NOT appear
  const hiddenRoutes = ["/admin", "/login", "/register", "/dashboard"];

  // Check if the current path starts with any of the hidden routes
  const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route));

  return (
    <>
      {!shouldHide && <Navbar1 />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
}
