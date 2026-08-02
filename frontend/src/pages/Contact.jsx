import React from 'react'
import { assets } from '../assets/assets'
import { toast } from "react-toastify"

const Contact = () => {

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied successfully!")
    } catch (error) {
      toast.error("Could not copy")
    }
  }


  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='font-semibold text-gray-700'>US</span></p>
      </div>

      <div className='flex flex-col my-10 justify-center md:flex-row gap-10 mb-28 text-sm '>
        <img className='w-full md:max-w-90' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600 '>OUR OFFICE</p>
          <p className='text-gray-500'>Ramgarh Bhunder, Bathinda <br /> 151101, Punjab</p>
          <p className='text-gray-500'> <a href="tel:+919876543210" onClick={(e) => {
            if (window.innerWidth > 768) {
              e.preventDefault()
              copyToClipboard('0164-291-2586')
            }
          }} className='cursor-pointer hover:text-black'>
            Tel: 0164-291-2586
          </a><br /> <a onClick={() => copyToClipboard('prescriptobyharman@gmail.com')}
            href="https://mail.google.com/mail/?view=cm&fs=1&to=prescriptobyharman@gmail.com&su=Inquiry&body=Hello,"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-black cursor-pointer'
          >
            Email: prescriptobyharman@gmail.com
            </a></p>
          <p className='font-semibold text-lg text-gray-600 '>CAREERS AT PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>

          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}

export default Contact