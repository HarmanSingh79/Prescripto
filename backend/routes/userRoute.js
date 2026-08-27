import express from "express"
import { registerUser,loginUser,getProfile, updateProfile,googleLogin, googleCallback, bookAppointment,sendForgotOtp, setForgotPass, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay, sendVerifyOTP, verifyEmail, verifyPhone } from "../controllers/userController.js"
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

userRouter.post('/verify-phone', authUser, verifyPhone)

userRouter.post("/send-verify-otp",authUser,sendVerifyOTP)
userRouter.post("/verify-account",authUser,verifyEmail)

// public forgot-password endpoints
userRouter.post("/send-forgot-otp", sendForgotOtp)
userRouter.post("/set-password", setForgotPass)

//routes for google login
userRouter.get('/google',googleLogin)
userRouter.get('/google/callback',googleCallback)

export default userRouter