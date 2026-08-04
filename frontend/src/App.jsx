import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import Doctors from "./pages/Doctors"
import Login from "./pages/Login"
import About from "./pages/About"
import Contact from "./pages/Contact"
import MyProfile from "./pages/MyProfile"
import MyAppointments from "./pages/MyAppointments"
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import VerifyEmail from './pages/VerifyEmail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from './context/AppContext'

const App = () => {

  const { userData } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!userData) return

    const exemptPaths = ['/my-profile', '/verify-email', '/login']
    if (exemptPaths.includes(location.pathname)) return

    if (!userData.isAccountVerified) return

    const dobMissing = !userData.dob || userData.dob === "Not Selected"
    const genderMissing = !userData.gender || userData.gender === "Not Selected"

    //!userData.isPhoneVerified
    if (!userData.phone  || dobMissing) {
      toast.info("Please complete your profile first")
      navigate('/my-profile')
    }
  }, [userData, location.pathname])

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
