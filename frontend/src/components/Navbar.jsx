import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='sm:w-44 w-30 cursor-pointer' src={assets.logo} alt="" />
      <ul className='hidden md:flex gap-5 font-medium'>
        <NavLink to="/">
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden ' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden ' />
        </NavLink>
        <NavLink to='about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden ' />
        </NavLink>
        <NavLink to='contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden ' />
        </NavLink>
      </ul>

      <div ref={dropdownRef} className='flex items-center gap-4'>
        {
          token && userData
            ? <div onClick={() => setIsDropdownOpen(prev => !prev)} className='z-20 flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-9 h-9 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className={`absolute top-full right-0 pt-2 text-base font-medium text-gray-600 z-40 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                <div className='min-w-48 bg-stone-100 flex flex-col gap-4 p-4' onClick={(e) => e.stopPropagation()}>
                  {
                    !userData.isAccountVerified
                      ? <>
                        <p className='text-sm text-gray-500'>Please verify your email to continue</p>
                        <p onClick={() => { navigate('/verify-email'); setIsDropdownOpen(false) }} className='text-primary underline cursor-pointer'>Verify Now</p>
                        <p onClick={() => { logout(); setIsDropdownOpen(false); navigate("/") }} className='hover:text-black cursor-pointer'>Logout</p>
                      </>
                      : <>
                        <p onClick={() => { navigate('/my-profile'); setIsDropdownOpen(false) }} className='hover:text-black cursor-pointer'>My Profile</p>
                        <p onClick={() => { navigate('/my-appointments'); setIsDropdownOpen(false) }} className='hover:text-black cursor-pointer'>My Apointments</p>
                        <p onClick={() => { logout(); setIsDropdownOpen(false); navigate("/") }} className='hover:text-black cursor-pointer'>Logout</p>
                      </>
                  }

                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white max-sm:px-3 px-4 max-sm:py-2 py-3 rounded-full font-light hidden md:block max-sm:block cursor-pointer'>Create Account</button>
        }

        <img onClick={() => setShowMenu(true)} className='w-4 md:hidden' src={assets.menu_icon} alt="" />

        {/* mobile menu  */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}>
          <div className='flex items-center justify-between py-6 px-6 '>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>

          <ul className='flex flex-col gap-2 items-center mt-5 px-5 text-lg font-medium'>
            <NavLink to="/" onClick={() => setShowMenu(false)}><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)}><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Navbar
