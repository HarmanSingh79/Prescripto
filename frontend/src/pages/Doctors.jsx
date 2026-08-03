import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Doctors = () => {

  const { speciality } = useParams(); //fetches the speciality of each doctor and load the required page dynamically by useParams hook

  const { doctors } = useContext(AppContext)

  const [filterDoc, setFilterDoc] = useState([])

  const [showFilter, setShowFilter] = useState(false)

  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])


  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        <button onClick={() => setShowFilter(prev => !prev)} className={`py-1 px-3 border rounded text-sm sm:hidden transition-all ${showFilter ? "bg-primary text-white" : ""}`} >Filters</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600  ${showFilter ? "flex" : "hidden sm:flex"}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General Physician" ? "bg-indigo-100 text-black " : ""}`}>General Physician</p>

          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black " : ""} `}>Gynecologist</p>

          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black " : ""} `}>Dermatologist</p>

          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black " : ""} `}>Pediatricians</p>

          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black " : ""} `}>Neurologist</p>

          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black " : ""} `}>Gastroenterologist</p>
        </div>

        <div className='grid grid-cols-3 md:grid-cols-5 w-full gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-2.5 transition-all duration-400'>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='max-sm:p-2 p-4'>
                  <div className={`flex items-center max-sm:text-xs text-sm max-sm:gap-1 gap-2 text-center ${item.available?"text-green-500":"text-gray-500"} `}>
                    <p className={`max-sm:h-1 max-sm:w-1 w-2 h-2  ${item.available ? "bg-green-500" : "bg-gray-500"}  rounded-full`}></p><p>{item.available ? "Available" : "Not available"}</p>
                  </div>
                  <p className='text-gray-900 text-lg max-sm:text-[12px] font-medium'>{item.name}</p>
                  <p className='text-gray-600 max-sm:text-[10px] text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors