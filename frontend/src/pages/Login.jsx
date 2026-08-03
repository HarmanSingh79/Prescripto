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

  const { backendURL, token, setToken } = useContext(AppContext)

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

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
          <input onChange={(e) => setPassword(e.target.value)} className="border border-zinc-300 rounded w-full p-2 mt-1" value={password} type={showPassword ? "text" : "password"}/>

          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 cursor-pointer text-gray-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</span>
        </div>

        <ul className="text-sm mt-1 space-y-0.5">
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
