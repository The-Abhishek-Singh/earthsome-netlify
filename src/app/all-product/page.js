import React from "react";
import ProductListingPage from "../../Components/Product/Product";
import FloatingCart from "@/Components/hf.jsx/FloatingCart";
function page() {
  return (
    <div className=" mb-[690px] sm:mb-[500px] md:mb-[490px] lg:mb-[400px] xl:mb-[271px]">
      <ProductListingPage />
      <FloatingCart />
    </div>
  );
}

export default page;
