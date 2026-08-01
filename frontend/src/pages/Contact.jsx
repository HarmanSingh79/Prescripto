import React from 'react'
import {assets} from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='font-semibold text-gray-700'>US</span></p>
      </div>

      <div className='flex flex-col my-10 justify-center md:flex-row gap-10 mb-28 text-sm '>
        <img className='w-full md:max-w-90' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600 '>OUR OFFICE</p>
          <p className='text-gray-500'>Near Mittal City Mall, Bathinda <br/> 151001, Punjab</p>
          <p className='text-gray-500'>Tel: 0164-291-2586 <br/> Email: prescriptobyharman@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600 '>CAREERS AT PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>

          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}

export default Contact