import FloatingCart from "@/Components/hf.jsx/FloatingCart";
import Home from "@/Components/Home/Carousel";
import CleanConsciousCarousel from "@/Components/Home/CleanConsciousCarousel";
import ProductsShowcase from "@/Components/Home/ProductsShowcase";
import Second from "@/Components/Home/Second";
import TestimonialCarousel from "@/Components/Home/Testimonial";
import MarqueeSectionTailwind from "@/Components/UI/marquee/Section";
import React from "react";

const page = () => {
  return (
    <div className="overflow-x-hidden  mb-[900px] sm:mb-[700px] md:mb-[600px] lg:mb-[485px] ">
      <div className="bg-white ">
        <div>
          <Home />
        </div>

        <Second />

        <MarqueeSectionTailwind />

        <ProductsShowcase />

        <CleanConsciousCarousel />

        <div className="py-20">
          <TestimonialCarousel />
        </div>
        <FloatingCart />
      </div>
    </div>
  );
};

export default page;
