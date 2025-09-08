import AboutUsPage from '@/Components/About/Aboutus'
import FloatingCart from '@/Components/hf.jsx/FloatingCart'
import React from 'react'

const page = () => {
  return (
    <div className=' mb-[1000px] sm:mb-[538px] md:mb-[585px] lg:mb-[423px]' >
      <AboutUsPage />
      <FloatingCart />
    </div>
  )
}

export default page
