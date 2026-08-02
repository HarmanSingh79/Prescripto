import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

const Footer = () => {

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Copied successfully!")
        } catch (error) {
            toast.error("Could not copy")
        }
    }

    const navigate = useNavigate()
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                {/* left section  */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6 '>Prescripto makes it simple to find trusted doctors and book appointments online.
                        We connect patients with verified specialists across a range of fields, so you can
                        manage your healthcare with confidence — anytime, anywhere.</p>
                </div>

                {/* middle section  */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='cursor-pointer' onClick={() => { navigate('/'); scrollTo(0, 0) }}>Home</li>
                        <li onClick={() => { navigate("/about"); scrollTo(0, 0) }} className='cursor-pointer'>About Us</li>
                        <li onClick={() => { navigate("/contact"); scrollTo(0, 0) }} className='cursor-pointer'>Contact Us</li>
                        <li className='cursor-pointer'>Privacy Policy</li>
                    </ul>
                </div>

                {/* right section  */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li> <a href="tel:+919876543210" onClick={(e) => {
                            if (window.innerWidth > 768) {
                                e.preventDefault()
                                copyToClipboard('0164-291-2586')
                            }
                        }} className='cursor-pointer hover:text-black'>
                            0164-291-2586
                        </a></li>
                        <li className='cursor-pointer'><a onClick={()=>copyToClipboard('prescriptobyharman@gmail.com')}
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=prescriptobyharman@gmail.com&su=Inquiry&body=Hello,"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='hover:text-black cursor-pointer'
                        >
                            prescriptobyharman@gmail.com
                        </a></li>
                    </ul>
                </div>
            </div>

            {/* Copyright text */}
            <div>
                <hr className='text-gray-400' />
                <p className='py-5 text-center text-sm'>Copyright &copy; {new Date().getFullYear()} Prescripto - All rights reserved</p>
            </div>
        </div>
    )
}

export default Footer
