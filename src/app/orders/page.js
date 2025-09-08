import FloatingCart from "@/Components/hf.jsx/FloatingCart";
import MyOrdersPage from "@/Components/Orders/Myorderpage";
import React from "react";

const page = () => {
  return (
    <div className="mt-20 mb-[1000px] sm:mb-[700px]  lg:mb-[485px] sm:mt-28 bg-white ">
      {/* <AboutUsPage /> */}
      <div className="md:mb-[600px] sm:mt-24 bg-white">
        <MyOrdersPage />
        <FloatingCart />
      </div>
    </div>
  );
};

export default page;
