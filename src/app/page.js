import Home from "@/Components/Home/Carousel";
import ProductsShowcase from "@/Components/Home/ProductsShowcase";
import Second from "@/Components/Home/Second";
import TestimonialCarousel from "@/Components/Home/Testimonial";
import MarqueeSectionTailwind from "@/Components/UI/marquee/Section";
import React from "react";

const page = () => {
  return (
    <div className="overflow-x-hidden mb-[482px] ">
      <div className="bg-white ">
        <div>
          <Home />
        </div>

        <Second />

        <ProductsShowcase />

        <MarqueeSectionTailwind />

        <div className="py-20 ">
          <TestimonialCarousel />
        </div>
      </div>
    </div>  
  );
};

export default page;
