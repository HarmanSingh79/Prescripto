import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

    const navigate = useNavigate()
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                {/* left section  */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6 '>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis totam beatae aliquid doloribus dignissimos ipsam quam blanditiis quod exercitationem explicabo nisi fugiat saepe illo nobis, neque inventore mollitia, ipsa dolor ad quae voluptas. Quasi esse est, error quis possimus minima ut pariatur ratione.</p>
                </div>

                {/* middle section  */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='cursor-pointer' onClick={() => { navigate('/'); scrollTo(0, 0) }}>Home</li>
                        <li onClick={()=>{navigate("/about");scrollTo(0,0)}} className='cursor-pointer'>About Us</li>
                        <li onClick={()=>{navigate("/contact");scrollTo(0,0)}}className='cursor-pointer'>Contact Us</li>
                        <li className='cursor-pointer'>Privacy Policy</li>
                    </ul>
                </div>
                {/* right section  */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='cursor-pointer'>0164-291-2586</li>
                        <li className='cursor-pointer'>prescriptobyharman@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* Copyright text */}
            <div>
                <hr className='text-gray-400'/>
                <p className='py-5 text-center text-sm'>Copyright &copy; {new Date().getFullYear()} Prescripto - All rights reserved</p>
            </div>
        </div>
    )
}

export default Footer
