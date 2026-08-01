import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {

  const navigate=useNavigate()

  const { backendURL, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/user/my-appointments", { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())//reverse is used to get the most recent appointment at the top
        // console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const {data}=await axios.post(backendURL+"/api/user/cancel-appointment",{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const initPay=(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Appointment Payment',
      description:'Appointment Payment paid to the doctor by the user',
      order_id:order.id,
      receipt:order.receipt,
      handler:async(res)=>{
        console.log(res)
        try{
          const {data}=await axios.post(backendURL+"/api/user/verify-razorpay",res,{headers:{token}})
          if(data.success){
            getUserAppointments()
            navigate("/my-appointments")
          }
        }catch(error){
          console.log(error);
          toast(error.message)
        }
      }
    }

    const rzp=new window.Razorpay(options)
    rzp.open()

  }

  const appointmentRazorpay=async(appointmentId)=>{
    try{
      const {data}=await axios.post(backendURL+"/api/user/payment-razorpay",{appointmentId},{headers:{token}})

      if(data.success){
        // console.log(data.order)
        initPay(data.order)
      }
    }catch(error){
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200'>My Appointments</p>
      <div>
        {
          appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-400' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.doctorData.image} alt="" />
              </div>

              <div className='flex-1 text-sm text-zinc-600 '>
                <p className='font-semibold text-neutral-800'>{item.doctorData.name}</p>
                <p>{item.doctorData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.doctorData.address.line1}</p>
                <p className='text-xs'>{item.doctorData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>

              <div></div>

              <div className='flex flex-col justify-center gap-2'>

                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 rounded text-stone-500 bg-indigo-50'>Paid</button>}

                {item.cancelled || item.payment || item.isCompleted ? "" : <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-400 hover:scale-105'>Pay Online</button>}

                {item.cancelled || item.isCompleted ? "" :<button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-400 hover:scale-105'>Cancel Appointment</button>}

                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 px-2'>This appointment is cancelled!</button>}

                {
                  item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
                }

              </div>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
