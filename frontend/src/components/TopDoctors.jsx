import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

  const navigate=useNavigate();
  const {doctors} =useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
      <p className='text-sm text-center sm:w-1/3'>Simply browse through our extensive list of trusted doctors.</p>

       {/* grid grid-cols-auto w-full gap-4 pt-5 gap-y-6 px-3 sm:px-0  */}
      <div className='grid grid-cols-3 md:grid-cols-5 w-full gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0,10).map((item, index)=>(
            <div onClick={() => {navigate(`/appointment/${item._id}`);scrollTo(0,0)}} key={index} className={`border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-2.5 transition-all duration-400 ${index >= 6 ? 'hidden md:block' : ''}`}>
                <img className='bg-blue-50 sm:h-54 max-sm:h-25 w-full' src={item.image} alt="" />
                <div className='max-sm:p-2 p-4'> 
                    <div className={`flex items-center max-sm:text-xs text-sm max-sm:gap-1 gap-2 text-center ${item.available?"text-green-500":"text-gray-500"} `}>
                        <p className={`max-sm:h-1 max-sm:w-1 w-2 h-2  ${item.available ? "bg-green-500" : "bg-gray-500"}  rounded-full`}></p><p>{item.available ? "Available" : "Not available"}</p>
                    </div>
                    <p className='text-gray-900 text-lg max-sm:text-[12px] font-medium'>{item.name}</p>
                    <p className='text-gray-600 max-sm:text-[10px] text-sm'>{item.speciality}</p>
                </div>
            </div>
        ))}
      </div>
      <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='bg-blue-50 text-gray-600 max-sm:px-6 px-12 max-sm:py-1.5 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default TopDoctors
