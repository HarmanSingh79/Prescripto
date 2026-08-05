import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from "../assets/assets.js"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { auth } from "../firebase"

const PHONE_OTP_ENABLED = import.meta.env.VITE_ENABLE_PHONE_OTP === 'true'

const MyProfile = () => {

  const { userData, setUserData, token, backendURL, loadUserProfileData } = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (userData && !userData.isAccountVerified) {
      toast.info("Please verify your email first")
      navigate('/verify-email')
    }
  }, [userData])

  useEffect(() => {

    //!userData.isPhoneVerified
    if (userData && (!userData.phone || !userData.dob)) {
      setEdit(true) // force edit mode open, can't be closed until filled
    }
  }, [userData])

  const [Edit, setEdit] = useState(false)
  const [image, setImage] = useState(false)

  //firebase otp setup
  const [phoneInput, setPhoneInput] = useState('')// what the user is typing, NOT saved yet
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const otpInputRefs = useRef([])

  // useEffect(() => {
  //   if (userData) {
  //     setPhoneInput(userData.phone || '')
  //   }
  // }, [userData])

  useEffect(() => {
    if (userData?.phone !== undefined) {
      setPhoneInput(userData.phone || '')
    }
  }, [userData?.phone])

  useEffect(() => {
    if (showOtpBox) {
      otpInputRefs.current[0]?.focus()
    }
  }, [showOtpBox])

  const handleOtpChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, '').slice(-1)

    if (value === '') {
      const updatedOtp = [...otp]
      updatedOtp[index] = ''
      setOtp(updatedOtp)
      return
    }

    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && otp[index] === '' && index > 0) {
      const updatedOtp = [...otp]
      updatedOtp[index - 1] = ''
      setOtp(updatedOtp)
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()
    const pastedText = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (!pastedText) return

    const updatedOtp = Array(6).fill('')
    pastedText.split('').forEach((digit, index) => {
      updatedOtp[index] = digit
    })

    setOtp(updatedOtp)
    const nextIndex = Math.min(pastedText.length, 5)
    otpInputRefs.current[nextIndex]?.focus()
  }

  const updateUserProfileData = async () => {
    // !userData.isPhoneVerified --> to be added in this if statement, if mobile verification to be used
    if (!phoneInput || !userData.dob || userData.dob === "Not Selected") {
      toast.error("Please verify your phone number and enter your date of birth")
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', phoneInput)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(backendURL + "/api/user/update-profile", formData, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const sendPhoneOtp = async () => {
    if (isSendingOtp) return

    setIsSendingOtp(true)

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
      }
      const formattedPhone = `+91${phoneInput}`
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier)
      setConfirmationResult(result)
      setShowOtpBox(true)
      toast.success("OTP sent to your phone")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const verifyPhoneOtp = async () => {
    try {
      const fullOtp = otp.join('')
      const result = await confirmationResult.confirm(fullOtp)
      const idToken = await result.user.getIdToken()

      const { data } = await axios.post(backendURL + "/api/user/verify-phone", { idToken, phone: phoneInput },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        setShowOtpBox(false)
        await loadUserProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Invalid OTP")
    }
  }

  return userData && (
    <div className='max-w-lg text-sm flex flex-col gap-2'>

      <div id="recaptcha-container"></div>

      {
        Edit
          ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 h-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
          : <img className='w-36 h-36 object-fit rounded' src={userData.image} alt="" />
      }


      {
        Edit
          ? <input className='bg-gray-50 text-3xl mt-4 font-medium max-w-60' type="text" value={userData.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='font-medium text-neutral-800 text-3xl mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-px border-none' />

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email ID:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            Edit
              ? <div className='flex flex-col gap-2'>
                <input className='bg-gray-200 no-spinner rounded p-1 max-w-52' type="number" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />

                {!showOtpBox&& PHONE_OTP_ENABLED && phoneInput !== userData.phone && (
                  <button
                    type="button"
                    onClick={sendPhoneOtp}
                    disabled={isSendingOtp}
                    className='text-xs cursor-pointer text-primary underline w-fit disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isSendingOtp ? 'Sending OTP...' : 'Send OTP to verify this number'}
                  </button>
                )}

                {PHONE_OTP_ENABLED &&showOtpBox && (
                  <div className='flex flex-col gap-2 mt-1'>
                    <div className='flex gap-1' onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpInputRefs.current[i] = el)}
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(e, i)}
                          onKeyDown={(e) => handleOtpKeyDown(e, i)}
                          className='w-8 h-9 text-center border rounded'
                        />
                      ))}
                    </div>
                    <button type="button" onClick={verifyPhoneOtp} className='text-xs bg-primary cursor-pointer text-white px-3 py-1 rounded w-fit'>
                      Verify
                    </button>
                  </div>
                )}
              </div>

              : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {
            Edit
              ? <p>
                <input placeholder="Line 1" className='bg-gray-200 min-w-52 rounded px-1 py-1 mb-2' value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} type="text" />
                <br />
                <input placeholder="Line 1" className='bg-gray-200 min-w-52 rounded px-1 py-1' value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} type="text" />
              </p>
              : <p className='text-gray-500'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
          }
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
            Edit
              ? <select className='max-w-30 bg-gray-200 p-1 rounded' value={userData.gender} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p>
          }

          <p className='font-medium'>Date of Birth:</p>
          {
            Edit
              ? <input className='max-w-30 bg-gray-200 p-1 rounded' value={userData.dob} type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
              : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-10'>
        {
          Edit
            //!userData.isPhoneVerified
            ? <button disabled={!phoneInput  || !userData.dob || userData.dob === "Not Selected"} className='border border-primary px-8 py-2 rounded-full cursor-pointer hover:bg-primary transition-all duration-500 hover:text-white hover:scale-105 disabled:opacity-50' onClick={updateUserProfileData}>Save Information</button>
            : <button className='border border-primary px-8 py-2 rounded-full ursor-pointer hover:bg-primary transition-all duration-500 hover:text-white hover:scale-105' onClick={() => setEdit(true)}>Edit</button>
        }
      </div>

    </div>
  )
}

export default MyProfile
