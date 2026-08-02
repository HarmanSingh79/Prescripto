import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect (() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 rounded-xl max-sm:max-w-[35vw] max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-indigo-50 max-sm:h-[20vh] group-hover:bg-primary transitiona-all duration-400' src={item.image} alt="" />
              <div className='p-4 max-sm:p-2'>
                <p className='text-neutral-800 text-lg font-medium max-sm:text-sm'>{item.name}</p>
                <p className='text-zinc-600 text-sm max-sm:text-xs'>{item.speciality}</p>

                <div className='mt-2 max-sm:mt-1 flex items-center gap-1 text-sm max-sm:text-xs'>
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <p className=''>Available</p>
                </div>

              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
