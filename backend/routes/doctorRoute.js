import express from "express";
import { doctorsList, loginDoctor, apppointmentsDoctor, appointmentCancel, appointmentComplete,doctorDashboard, doctorProfile, updateDoctorProfile,resetDoctorPassword, sendPassResetOtp, setForgotPass, sendForgotOtp } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter=express.Router()

doctorRouter.get("/list",doctorsList)
doctorRouter.post("/login",loginDoctor)
doctorRouter.get("/appointments",authDoctor, apppointmentsDoctor)
doctorRouter.post("/complete-appointment",authDoctor, appointmentComplete)
doctorRouter.post("/cancel-appointment",authDoctor, appointmentCancel)
doctorRouter.get("/dashboard",authDoctor, doctorDashboard)
doctorRouter.get("/profile",authDoctor, doctorProfile)
doctorRouter.post("/update-profile",authDoctor, updateDoctorProfile)

// doctorRouter.post("/change-password",authDoctor, changeDoctorPassword)
doctorRouter.post("/send-reset-otp",authDoctor, sendPassResetOtp)
doctorRouter.post("/reset-password",authDoctor, resetDoctorPassword)

// public forgot-password endpoints
doctorRouter.post("/send-forgot-otp", sendForgotOtp)
doctorRouter.post("/set-password", setForgotPass)

export default doctorRouter