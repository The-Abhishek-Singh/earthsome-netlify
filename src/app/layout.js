// import "./globals.css";
// import { Inter } from "next/font/google";
// import Providers from "./Providers";
// import NavbarFooterWrapper from "@/Components/NavbarFooterWrapper";

// const inter = Inter({ 
//   subsets: ["latin"],
//   display: 'swap',
//   variable: '--font-inter'
// });

// export const metadata = {
//   title: "Earthsome",
//   description: "Your app description",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${inter.variable}`}
//         suppressHydrationWarning={true}
//       >
//         <Providers>
//           <NavbarFooterWrapper>
//             {children}
//           </NavbarFooterWrapper>
//         </Providers>
//       </body>
//     </html>
//   );
// }







import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./Providers";
import NavbarFooterWrapper from "@/Components/NavbarFooterWrapper";
import { useEffect } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// export const metadata = {
//   title: "Earthsome",
//   description: "Your app description",
// };

function DisableInspect() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable common inspect shortcuts
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}`}
        suppressHydrationWarning={true}
      >
        <DisableInspect /> {/* 👈 inject blocking here */}
        <Providers>
          <NavbarFooterWrapper>
            {children}
          </NavbarFooterWrapper>
        </Providers>
      </body>
    </html>
  );
}
