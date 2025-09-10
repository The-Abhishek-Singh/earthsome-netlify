import ContactPage from '@/Components/Contact/ContactPage'
import FloatingCart from '@/Components/hf.jsx/FloatingCart'
import React from 'react'

const page = () => {
  return (
    <div className='mb-[660px] sm:mb-[465px] md:mb-[470px] lg:mb-[350px] xl:mb-[300px]  sm:mt-28 bg-white  '>
    
    <ContactPage />

   <FloatingCart />


    </div>
  )
}

export default page
