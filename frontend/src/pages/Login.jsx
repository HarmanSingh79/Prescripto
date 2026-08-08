import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react"

const Login = () => {

  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [resetEmail, setResetEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const { backendURL, token, setToken,sendForgotOtp, setForgotPass } = useContext(AppContext)

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleSendForgotOtp = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email")
      return
    }
    const success = await sendForgotOtp(resetEmail)
    if (success) setResetStep(2)
  }

  const handleForgotPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match")
      return
    }
    const success = await setForgotPass(resetEmail, otp, newPassword)
    if (success) closeForgotPassword()
  }

  const closeForgotPassword = () => {
    setShowForgotPassword(false)
    setResetStep(1)
    setResetEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()//when the form is submitted, it will not reload the webpage

    try {
      if (state == "Sign Up") {
        const { data } = await axios.post(backendURL + "/api/user/register", { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/verify-email')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendURL + "/api/user/login", { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [])


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] items-center flex m-auto'>
      <div className='flex flex-col m-auto gap-3 items-start max-sm:p-6 p-8 min-w-85 sm:min-w-96 border rounded-xl text-zinc-600 shadow-lg'>
        <p className='text-2xl font-semibold'>{state === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment</p>

        {
          state === "Sign Up" ? <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
          </div> : ""
        }

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>


        <div className="relative w-full">
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} className="border border-zinc-300 rounded w-full p-2 mt-1" value={password} type={showPassword ? "text" : "password"} />

          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 cursor-pointer text-gray-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</span>
        </div>

        {
          state === "Sign Up"
            ? <ul className="text-sm mt-1 space-y-0.5">
              {Object.entries({
                "At least 8 characters": checks.length,
                "One lowercase letter": checks.lowercase,
                "One uppercase letter": checks.uppercase,
                "One number": checks.number,
                "One special character": checks.special,
              }).map(([label, ok]) => (
                <li key={label} className={ok ? "text-green-600" : "text-red-500"}>
                  {ok ? "✓" : "✗"} {label}
                </li>
              ))}
            </ul>
            : ""
        }

        {state === 'Login' && (
          <p className="text-primary text-sm text-right cursor-pointer" onClick={() => setShowForgotPassword(true)}>Forgot password?</p>
        )}

        {showForgotPassword && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-80 flex flex-col gap-3 relative">
              <p className="text-lg font-medium">Reset Password</p>

              {resetStep === 1 && (
                <>
                  <input type="email" placeholder="Enter your registered email" className="border rounded px-3 py-2 border-gray-400" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />

                  <button type="button" onClick={handleSendForgotOtp} className="hover:bg-primary cursor-pointer hover:text-white py-2 rounded border border-gray-200 transition-all duration-300">
                    Send OTP</button>
                </>
              )}

              {resetStep === 2 && (
                <>
                  <input type="text" placeholder="Enter OTP" className="border rounded px-3 py-2"
                    value={otp} onChange={(e) => setOtp(e.target.value)} />

                  <input type={showPassword ? "text" : "password"} placeholder="New password" className="border rounded px-3 py-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                  <input type={showPassword ? "text" : "password"} placeholder="Confirm new password" className="border rounded px-3 py-2" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

                  <button onClick={() => setShowPassword(!showPassword)} className="hover:bg-primary hover:text-white transition-all duration-200 border border-gray-300 rounded cursor-pointer py-1 text-gray-500">{showPassword ? "Hide" : "Show"}</button>

                  <button type="button" onClick={handleForgotPassword} className="bg-primary cursor-pointer text-white py-2 rounded"> Reset Password </button>

                  <p className="text-sm text-primary cursor-pointer" onClick={handleSendForgotOtp}>
                    Didn't get it? Resend OTP </p>
                </>
              )}

              <p className="text-sm text-gray-500 transition-all duration-300 cursor-pointer hover:bg-red-500 hover:text-white py-2 border border-gray-200 rounded text-center" onClick={closeForgotPassword}>  Cancel </p>
            </div>
          </div>
        )}

        {/* <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div> */}

        <button type='submit' className='w-full bg-primary cursor-pointer text-white py-2 rounded-md text-base'>{state === "Sign Up" ? "Create Account" : "Login"}</button>

        {
          state === "Sign Up" ?
            <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span> </p> :
            <p>Or create a new account! <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span> </p>

        }

      </div>
    </form>
  )
}

export default Login
