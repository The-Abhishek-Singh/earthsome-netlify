import FloatingCart from "@/Components/hf.jsx/FloatingCart";
import MyOrdersPage from "@/Components/Orders/Myorderpage";
import React from "react";

const page = () => {
  return (
    <div className="mt-20 mb-[660px] sm:mb-[465px] md:mb-[470px] lg:mb-[350px] xl:mb-[290px] bg-white ">
      {/* <AboutUsPage /> */}
      <div className="bg-white">
        <MyOrdersPage />
        <FloatingCart />
      </div>
    </div>
  );
};

export default page;
