import express from "express"
import { registerUser,loginUser,getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay, sendVerifyOTP, verifyEmail } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js"

const userRouter=express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

userRouter.get("/get-profile",authUser, getProfile)
userRouter.post("/update-profile",upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment",authUser, bookAppointment)
userRouter.get("/my-appointments",authUser,listAppointments)
userRouter.post("/cancel-appointment",authUser,cancelAppointment)
userRouter.post("/payment-razorpay",authUser,paymentRazorpay)
userRouter.post("/verify-razorpay",authUser,verifyRazorpay)
userRouter.post("/send-verify-otp",authUser,sendVerifyOTP)
userRouter.post("/verify-account",authUser,verifyEmail)

export default userRouter