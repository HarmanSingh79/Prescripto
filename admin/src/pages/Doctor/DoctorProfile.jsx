import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from "react-toastify"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData, backendURL, sendResetOtp, resetPasswordWithOtp } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [edit, setEdit] = useState(false)

  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const { data } = await axios.post(backendURL + "/api/doctor/update-profile", updateData, { headers: { dToken } })

      if (data.success) {
        toast.success(data.message)
        setEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleSendOtp = async () => {
    if (!profileData?.email) {
      toast.error("Doctor email not found")
      return
    }

    if (!oldPassword) {
      toast.error("Please enter your current password")
      return
    }

    setIsSendingOtp(true)
    const success = await sendResetOtp(profileData.email, oldPassword)
    if (success) {
      setOtpSent(true)
      setOtp('')
    }
    setIsSendingOtp(false)
  }

  const handleVerifyOtpAndResetPassword = async () => {
    if (!otp || !oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill OTP and password fields")
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsResetting(true)
    const success = await resetPasswordWithOtp(profileData.email, oldPassword, otp, newPassword)
    if (success) {
      setOtpSent(false)
      setOtp('')
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    }
    setIsResetting(false)
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  return profileData && (
    <div>

      <div className='flex flex-col gap-4 m-5'>

        <div>
          <img className='bg-primary/80 w-full max-sm:h-52 h-60 max-sm:max-w-50 sm:max-w-64 rounded-lg ' src={profileData.image} alt="" />
        </div>

        <div className='flex-1 border border-stone-300 rounded-lg max-sm:p-3 p-8 max-sm:py-3 py-7 bg-white'>
          {/* doctor information flex gap-2*/}
          <p className='items-center text-3xl font-medium text-gray-700 max-sm:text-lg'>{profileData.name}</p>

          <div className='flex items-center gap-2 mt-1 text-gray-600 max-sm:text-xs'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='max-sm:py-0 max-sm:px-1 py-0.5 px-2 border max-sm:text-[9px] text-xs rounded-full border-gray-400'>{profileData.experience}</button>
          </div>

          {/* doctor's about flex gap-1 */}
          <div>
            <p className='items-center text-sm font-medium text-neutal-800 mt-3'>About</p>
            <p className='text-sm text-gray-600 max-w-175 mt-1'>{profileData.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4 max-sm:text-[15px]'>Appointment Fees: <span className='text-gray-800'>{currency}{edit ? <input className='w-10 outline-none no-spinner' value={profileData.fees} type="number" onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}></input> : profileData.fees}</span></p>

          <div className='flex gap-2 py-2 max-sm:text-sm'>
            <p>Address:</p>
            <div className='text-sm'>
              <p>{edit ? <input value={profileData.address.line1} type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} /> : profileData.address.line1}</p>
              <p>{edit ? <input value={profileData.address.line2} type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} /> : profileData.address.line2}</p>
            </div>

          </div>

          <div className='flex gap-1 pt-2 max-sm:text-sm'>
            <input onChange={() => edit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} type="checkbox" name="" id="" />
            <label htmlFor="">Available</label>
          </div>


          {
            edit &&
            <div className='flex flex-col gap-1 mt-6'>
              <p className='text-lg text-stone-800'>Change Password</p>
              <p className='text-sm text-gray-500'>We will send a one-time code to your registered email.</p>
              <div className='flex flex-col gap-2'>
                {!otpSent ? (
                  <>

                    <div className='w-fit relative'>
                      <input placeholder='Enter current password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type={showPassword ? "text" : "password"} className='  border w-60 outline-none focus:border-gray-400 border-gray-300 rounded pr-10 px-2 py-1' />
                      <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 cursor-pointer text-gray-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</span>
                    </div>
                    

                    <button onClick={handleSendOtp} disabled={isSendingOtp} className='max-sm:text-xs w-60 max-sm:py-0.5 max-sm:px-4.5 px-4 py-2 border cursor-pointer border-primary text-sm rounded-full mt-2 hover:text-white hover:bg-primary transition-all disabled:opacity-60'>
                      {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className='w-fit'>
                      <input placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)} className='border w-60 outline-none focus:border-gray-400 border-gray-300 rounded px-2 py-1' />
                    </div>

                    <div className='w-fit'>
                      <input placeholder='Enter new password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showPassword ? "text" : "password"} className='border w-60 outline-none focus:border-gray-400 border-gray-300 rounded pr-10 px-2 py-1' />
                    </div>

                    <div className='w-fit'>
                      <input placeholder='Confirm new password' value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} type={showPassword ? "text" : "password"} className='border w-60 outline-none focus:border-gray-400 border-gray-300 rounded pr-10 px-2 py-1' />
                    </div>

                    <button onClick={() => setShowPassword(!showPassword)} className="hover:bg-primary hover:text-white transition-all duration-200 border border-gray-300 rounded w-60 cursor-pointer py-1 text-gray-500">{showPassword ? "Hide" : "Show"}</button>

                    <button onClick={handleVerifyOtpAndResetPassword} disabled={isResetting} className='max-sm:text-xs w-60 max-sm:py-0.5 max-sm:px-4.5 px-4 py-2 border border-primary text-sm rounded-full cursor-pointer mt-2 hover:text-white hover:bg-primary transition-all disabled:opacity-60'>
                      {isResetting ? 'Verifying...' : 'Verify OTP & Update Password'}
                    </button>
                  </>
                )}
              </div>
            </div>
          }


          {
            edit
              ? <button onClick={updateProfile} className='max-sm:text-xs min-w-43 max-sm:py-0.5 max-sm:px-4.5 px-4 py-2 border border-primary text-sm rounded-full mt-5 hover:text-white hover:bg-primary transition-all'>Save</button>
              : <button onClick={() => setEdit(true)} className='max-sm:text-xs min-w-43 max-sm:py-0.5 max-sm:px-4.5 px-4 py-2 border border-primary text-sm rounded-full mt-5 hover:text-white hover:bg-primary transition-all'>Edit</button>
          }

        </div>
      </div>

    </div>
  )
}

export default DoctorProfile
