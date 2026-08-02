import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { removeBackground } from '@imgly/background-removal'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General Physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const [originalImg, setOriginalImg] = useState(false)//raw upload
  const [processedImg, setProcessedImg] = useState(false)//bg-removed version
  const [removeBg, setRemoveBg] = useState(false) //toggle state
  const [isRemovingBg, setIsRemovingBg] = useState(false)

  const { backendURL, aToken } = useContext(AdminContext)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }

    setOriginalImg(file)
    setProcessedImg(false)

    if (removeBg) {
      await processImage(file)
    } else {
      setDocImg(file)
    }
  }

  const processImage = async (file) => {
    try {
      setIsRemovingBg(true)
      const resultBlob = await removeBackground(file)
      const processedFile = new File(
        [resultBlob],
        file.name.replace(/\.[^/.]+$/, "") + ".png",
        { type: 'image/png' }
      )
      setProcessedImg(processedFile)
      setDocImg(processedFile)
    } catch (error) {
      console.error("Background removal failed:", error)
      toast.error("Couldn't remove background, using original instead")
      setDocImg(file)
    } finally {
      setIsRemovingBg(false)
    }
  }

  const handleToggleChange = async () => {
    const newValue = !removeBg
    setRemoveBg(newValue)

    if (!originalImg) {
      return
    }

    if (newValue) {
      if (processedImg) {
        setDocImg(processedImg)
      } else {
        await processImage(originalImg)
      }
    } else {
      setDocImg(originalImg)
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (!docImg) {
        return toast.error("Image not selected!")
      }

      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('speciality', speciality)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`)
      })

      const { data } = await axios.post(backendURL + '/api/admin/add-doctor', formData, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)

        setDocImg(false)
        setOriginalImg(false)
        setProcessedImg(false)
        setRemoveBg(false)
        setName('')
        setEmail('')
        setPassword('')
        setFees('')
        setAbout('')
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full max-sm:m-3'>

      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border border-gray-300 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        <div className='flex flex-col gap-3 mb-8 text-gray-500'>
          <div className='flex items-center gap-4'>
            <label htmlFor="doc-img">
              {isRemovingBg ? (
                <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer animate-pulse'>
                  <span className='text-[10px] text-gray-500 text-center px-1'>Processing...</span>
                </div>
              ) : (
                <img
                  className='w-16 h-16 rounded-full object-cover bg-gray-100 cursor-pointer border border-gray-200'
                  src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                  alt=""
                />
              )}
            </label>

            <input onChange={handleImageUpload} type="file" id="doc-img" hidden accept="image/*" />
            <p>Upload doctor <br /> image</p>
          </div>

          {/* Toggle */}
          <label className='flex items-center gap-2 cursor-pointer w-fit'>
            <div className='relative'>
              <input
                type="checkbox"
                checked={removeBg}
                onChange={handleToggleChange}
                className='sr-only peer'
              />
              <div className='w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors'></div>
              <div className='absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4'></div>
            </div>
            <span className='text-sm text-gray-600'>Remove background</span>
          </label>

          {/* Before/after comparison thumbnails */}
          {originalImg && processedImg && (
            <div className='flex gap-3 items-center'>
              <div className='text-center'>
                <img
                  className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer ${!removeBg ? 'border-primary' : 'border-gray-200'}`}
                  src={URL.createObjectURL(originalImg)}
                  alt="Original"
                  onClick={() => { setRemoveBg(false); setDocImg(originalImg) }}
                />
                <p className='text-xs text-gray-500 mt-1'>Original</p>
              </div>
              <div className='text-center'>
                <img
                  className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer bg-gray-50 ${removeBg ? 'border-primary' : 'border-gray-200'}`}
                  src={URL.createObjectURL(processedImg)}
                  alt="Background removed"
                  onClick={() => { setRemoveBg(true); setDocImg(processedImg) }}
                />
                <p className='text-xs text-gray-500 mt-1'>No background</p>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Doctor name</p>
              <input value={name} onChange={(e) => setName(e.target.value)} className='border rounded px-3 max-sm:py-0.5 py-2' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Doctor Email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Doctor Password</p>
              <input value={password} onChange={(e) => setPassword(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' type="password" placeholder='Password' required />
            </div>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Experience</p>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Fees</p>
              <input value={fees} onChange={(e) => setFees(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Speciality</p>
              <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' name="" id="">
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1 max-sm:gap-0'>
              <p>Education</p>
              <input value={degree} onChange={(e) => setDegree(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' type="text" placeholder='Education' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input value={address1} onChange={(e) => setAddress1(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' type="text" placeholder='Line 1' required />
              <input value={address2} onChange={(e) => setAddress2(e.target.value)} className='border max-sm:py-0.5 rounded px-3 py-2' type="text" placeholder='Line 2' required />
            </div>

          </div>

        </div>

        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='w-full px-4 pt-2 border rounded' placeholder='Write about doctor' row={4} required />
        </div>

        <button type='submit' className='bg-primary text-white px-10 py-3 mt-4 rounded-full'>Add Doctor</button>

      </div>

    </form>
  )
}

export default AddDoctor
