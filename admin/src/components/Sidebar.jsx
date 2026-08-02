import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r border-gray-300'>

      {/* For Admin */}
      {
        aToken && 
        <ul className='text-[#515151] mt-5'>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/admin-dashboard'}>
            <img className='w-5 h-5 shrink-0' src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/all-appointments'}>
            <img className='w-5 h-5 shrink-0' src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/add-doctor'}>
            <img className='w-5 h-5 shrink-0' src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/doctors-list'}>
            <img className='w-5 h-5 shrink-0' src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>
        </ul>
      }

      {/* For Doctor */}
      {
        dToken && 
        <ul className='text-[#515151] mt-5'>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/doctor-dashboard'}>
            <img className='w-5 h-5 shrink-0' src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/doctor-appointments'}>
            <img className='w-5 h-5 shrink-0' src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#f2f3ff] border-l-4 border-primary" :""}`} to={'/doctor-profile'}>
            <img className='w-5 h-5 shrink-0' src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar
