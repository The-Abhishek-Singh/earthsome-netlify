import React from "react";
import ProductListingPage from "../../Components/Product/Product";
import FloatingCart from "@/Components/hf.jsx/FloatingCart";
function page() {
  return (
    <div className= ' mt-20 mb-[1000px] sm:mb-[700px] md:mb-[600px] lg:mb-[485px] '>
      <ProductListingPage />
      <FloatingCart />
    </div>
  );
}

export default page;
