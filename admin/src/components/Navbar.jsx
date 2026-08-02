import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from "react-router-dom"
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext)
    const {dToken, setDToken}=useContext(DoctorContext)

    const navigate=useNavigate()

    const logout=()=>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        
        dToken &&  setDToken('')
        dToken && localStorage.removeItem('dToken')
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-300 bg-white'>
            <div className='flex items-center gap-3 text-xs'>
                <img className='w-36 max-sm:w-26 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
                <p className='border max-sm:px-2 max-sm:py-0 px-2.5 py-1 max-sm:text-[8px] text-sm rounded-full border-gray-500 text-gray-600 font-semibold'>{aToken ? 'Admin' : 'Doctor'}</p>
            </div>
            <button onClick={logout} className='bg-primary text-white max-sm:text-[10px] text-sm max-sm:px-3 max-sm:py-1 px-10 py-2 rounded-full hover:scale-105 transition-all'>Logout </button>
        </div>
    )
}

export default Navbar