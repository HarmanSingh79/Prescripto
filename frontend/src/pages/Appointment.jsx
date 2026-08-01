import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios'

const Appointment = () => {

  const navigate = useNavigate();

  const { doctors, currencySymbol, backendURL, token, getDoctorsData } = useContext(AppContext);
  const { docId } = useParams();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    // console.log(docInfo)
  }

  const getAvailableSlots = async () => {
    if (!docInfo) {
    return
    }
    setDocSlots([])

    let today = new Date()//contains date and time
    for (let i = 0; i < 7; i++) {
      let currDate = new Date(today)//copy of today (so that the original variable isnt modified)
      // .getDate(): Returns the day of the month (1-31) for the given date. 
      // .setDate(day): Sets the day of the month. The code uses currDate.setDate(today.getDate() + i) to advance the date by i days.
      currDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)//until 09:00PM

      if (today.getDate() === currDate.getDate()) {
        currDate.setHours(currDate.getHours() > 10 ? currDate.getHours() + 1 : 10)
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currDate.setHours(10)
        currDate.setMinutes(0)
      }

      let timeSlots = []

      while (currDate < endTime) {
        let formattedTime = currDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currDate.getDate()
        let month = currDate.getMonth() + 1 //+1 because first month is at index 0
        let year = currDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          //add slot to array
          timeSlots.push({
            datetime: new Date(currDate),
            time: formattedTime
          })
        }

        //Increment current time by 30 minutes
        currDate.setMinutes(currDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))

    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment.')
      return navigate('/login')
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(backendURL + "/api/user/book-appointment", { docId, slotDate, slotTime }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    // console.log(docSlots)
  }, [docSlots])


  return docInfo && (
    <div>
      {/* Doctors Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0'>
          {/* name, degree, experience */}
          <p className='flex text-gray-900 font-medium items-center gap-2 text-2xl'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>

          <div className='flex gap-2 items-center text-sm mt-1 text-gray-600 '>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='flex gap-1 items-center text-sm font-medium text-gray-900 mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
            <p className='text-sm mt-1 text-gray-500 max-w-175'>{docInfo.about}</p>
          </div>

          <div>
            <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
          </div>
        </div>
      </div>

      {/* Booking slots */}
      <div className='font-medium sm:ml-72 sm:p-4 mt-4 text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray'}`} key={index}>
                {/* item[0].datetime: Accesses the Date object stored in the first slot.
                    .getDay(): A JavaScript Date method that returns the day of the week as a number */}
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm rounded-full shrink-0 font-light px-5 py-2 cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time}
              </p>
            ))
          }
        </div>
        <div>
          <button onClick={bookAppointment} className='bg-primary text-sm text-white font-light px-14 py-3 rounded-full my-6 cursor-pointer'>Book an appointment</button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

      </div>

    </div>
  )
}

export default Appointment
