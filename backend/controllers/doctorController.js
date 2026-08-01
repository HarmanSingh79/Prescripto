import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"

//availability status can be changed by the both admin and the doctor
const changeAvailability=async(req,res)=>{
    try{
        const {docId}=req.body 
        const docData=await doctorModel.findById(docId)
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available} )
        res.json({success:true, message:"Availability status changed!"}) 
    }catch(error){
        res.json({success:false, message:error.messge})
        console.log(error)

    }
}

const doctorsList=async(req,res)=>{
    try{
        const doctors= await doctorModel.find({}).select(['-password','-email'])//exclude password and email
        res.json({success:true, doctors})
    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//login the doctor
const loginDoctor=async(req,res)=>{
    try {
        const {email,password}=req.body
        const doctor=await doctorModel.findOne({email})
        if(!doctor){
            return res.json({sucess:false, message:"Invalid credentials!"})
        }
        
        const isMatch=await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            return res.json({success:true, token})
        }else{
            return res.json({sucess:false, message:"Invalid credentials!"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//get appointments for doctor
const apppointmentsDoctor=async(req,res)=>{
    try {
        const docId=req.docId
        const appointments=await appointmentModel.find({docId})

        res.json({success:true, appointments})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//api to mark the appointment as completed
const appointmentComplete=async(req,res)=>{
    try {
        const docId=req.docId
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})
            return res.json({success:true, message:"Appointment Completed!"})
        }else{
            return res.json({success:false, message:"Failed to complete the request."})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//api to cancel the appointment by doctor
const appointmentCancel=async(req,res)=>{
    try {
        const docId=req.docId
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
            return res.json({success:true, message:"Appointment Cancelled!"})
        }else{
            return res.json({success:false, message:"Cancellation failed."})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//api to get dashboard data
const doctorDashboard=async(req,res)=>{
    try {
        const docId=req.docId
        const appointments=await appointmentModel.find({docId});
        let earnings=0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount;
            }
        })
        let patients=[]
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//api to get doctor profile
const doctorProfile=async(req,res)=>{
    try{
        const docId=req.docId
        const profileData=await doctorModel.findById(docId).select("-password")
        res.json({success:true, profileData})
    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//api to update the doctor profile
const updateDoctorProfile=async(req,res)=>{
    try {
        const docId=req.docId
        const {fees, address, available}=req.body
        await doctorModel.findByIdAndUpdate(docId, {fees, address, available})
        res.json({success:true, message:"Profile Updated!"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export {changeAvailability, doctorsList, loginDoctor, apppointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile } 