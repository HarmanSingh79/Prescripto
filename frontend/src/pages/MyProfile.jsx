import React, { useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {assets} from "../assets/assets.js"
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {

  const {userData, setUserData, token, backendURL, loadUserProfileData}=useContext(AppContext)

  const [Edit, setEdit] = useState(false)
  const [image, setImage]=useState(false)

  const updateUserProfileData=async()=>{
    try{
      const formData=new FormData()
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const {data}=await axios.post(backendURL+"/api/user/update-profile",formData,{headers:{token}})

      if(data.success){
        toast.success(data.message)
        await loadUserProfileData()
        setEdit(false)
        setImage(false)
      }else{
        toast.error(data.message)
      }

    }catch(error){
      console.log(error)
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='max-w-lg text-sm flex flex-col gap-2'>

      {
        Edit
        ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden/>
        </label>
        : <img className='w-36 rounded' src={userData.image} alt="" />
      }

      
      {
        Edit
          ? <input className='bg-gray-50 text-3xl mt-4 font-medium max-w-60' type="text" value={userData.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='font-medium text-neutral-800 text-3xl mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-px border-none'/>

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email ID:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            Edit
              ? <input className='bg-gray-100 max-w-52' type="text" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {
            Edit
            ? <p>
                <input className='bg-gray-50 min-w-55' value={userData.address.line1} onChange={(e)=>setUserData(prev=>({...prev, address:{...prev.address,line1:e.target.value}}))} type="text" />
                <br />
                <input className='bg-gray-50 min-w-55' value={userData.address.line2} onChange={(e)=>setUserData(prev=>({...prev, address:{...prev.address,line2:e.target.value}}))} type="text" />
            </p>
            : <p className='text-gray-500 '>
              {userData.address.line1}
              <br/>
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
              ? <select className='max-w-20 bg-gray-100' value={userData.gender} onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))}>
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p>
          }

          <p className='font-medium'>Date of Birth:</p>
          {
            Edit
            ? <input className='max-w-28 bg-gray-100' value={userData.dob} type="date" onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))}/>
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-10'>
        {
          Edit
          ? <button className='border border-primary px-8 py-2 rounded-full cursor-pointer hover:bg-primary transition-all duration-500 hover:text-white hover:scale-105' onClick={updateUserProfileData}>Save Information</button>
          : <button className='border border-primary px-8 py-2 rounded-full ursor-pointer hover:bg-primary transition-all duration-500 hover:text-white hover:scale-105' onClick={()=>setEdit(true)}>Edit</button>
        }
      </div>

    </div>
  )
}

export default MyProfile