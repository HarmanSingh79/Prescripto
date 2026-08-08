import validator from "validator"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import transporter from "../config/nodemailer.js"
import { adminAuth } from '../config/firebaseAdmin.js'
// import admin from '../config/firebaseAdmin.js'


//checking the password strength
const isStrongPassword = (password) => {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return { valid: Object.values(checks).every(Boolean), checks };
};

//api to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing details!" })
        }

        //validate the email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        //checking the password strength
        if (!isStrongPassword(password).valid) {
            return res.json({ success: false, message: "Enter a strong password!" })
        }

        //hash the user password
        const salt = await bcrypt.genSalt(10) //value is between 5-15
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, email,
            password: hashedPassword
        }

        //add the user in database
        const newUser = new userModel(userData)
        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
        await sendWelcomeEmail(newUser.email, newUser.name).catch(err =>
            console.log("Welcome email failed!", err.message)
        )

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// send OTP for forgot-password flow (no auth)
const sendForgotOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.json({ success: true, message: "If this email is registered, an OTP has been sent" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: true, message: "If this email is registered, an OTP has been sent" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000
        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Prescripto - Password Reset OTP",
            text: `Your OTP for resetting your Prescripto user account password is ${otp}. It is valid for 10 minutes.`
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true, message: "If this email is registered, an OTP has been sent" })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}


// set password using forgot-password OTP (no auth)
const setForgotPass = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        if (!email || !otp || !newPassword) {
            return res.json({ success: false, message: "Missing required fields" })
        }

        if (!validator.isStrongPassword(newPassword, {
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            return res.json({ success: false, message: "New password is not strong enough" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Invalid email or OTP" })
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            user.resetOtp = ''
            user.resetOtpExpireAt = 0
            await user.save()
            return res.json({ success: false, message: "OTP has expired" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Prescripto - Password Changed",
            text: `Hey ${user.name}, your password for your user profile has been changed successfully!`
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

//api to verify otp sent to phone
const verifyPhone = async (req, res) => {
    try {
        const { idToken, phone } = req.body
        // const decoded = await admin.auth().verifyIdToken(idToken)
        const decoded = await adminAuth.verifyIdToken(idToken)

        if (decoded.phone_number !== `+91${phone}`) {
            return res.json({ success: false, message: "Phone mismatch" })
        }

        const user = await userModel.findById(req.userId)
        user.phone = phone
        user.isPhoneVerified = true
        await user.save()

        res.json({ success: true, message: "Phone number verified and updated" })
    } catch (error) {
        res.json({ success: false, message: "Invalid or expired verification" })
    }
}


//welcome email
const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Prescripto 🎉",
        html: `<h2>Hi ${name},</h2>
           <p>Welcome to Prescripto! Your account has been created successfully.</p>
           <p>Please verify your email to start booking appointments.</p>`
    };
    await transporter.sendMail(mailOptions);
};

//api for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist!" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (match) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to send otp for email verification
const sendVerifyOTP = async (req, res) => {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found!" })
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified!, please login." })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000 //for 10 minutes
        await user.save()

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify your Email - Prescripto',
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`
        }

        await transporter.sendMail(mailOptions)

        res.json({ success: true, message: "OTP sent to your email" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to verify the otp
const verifyEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body

        if (!userId || !otp) {
            return res.json({ success: false, message: "Missing details" })
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired!" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpiresAt = 0

        await user.save()

        res.json({ success: true, message: "Email verified successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await userModel.findById(userId).select("-password")
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (!user.isAccountVerified) {
            return res.json({ success: false, message: "Please verify your email before updating your profile" })
        }

        const { name, phone, address, dob, gender } = req.body

        const imageFile = req.file

        if (!(name && phone && dob && gender) || dob === "Not Selected" || gender === "Not Selected") {
            return res.json({ success: false, message: "Some details are missing!" })
        }

        // if (phone !== user.phone || !user.isPhoneVerified) {
        //     return res.json({ success: false, message: "Please verify your phone number before saving" })
        // }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }
        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to book appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available!" })
        }

        let slots_booked = docData.slots_booked
        //checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available!" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            doctorData: docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in doctor's data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment booked!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to get appointments booked by user for "my-appointmnets" page
const listAppointments = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to cancel the appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        //verify if the appointment is booked by the user who is cancelling it
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized access!" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //if payment is cancelled, then show that cancelled slot on the doctors page
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)//removing the cancelled time slot from booked slots

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: "Appointment cancelled!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//api to make payment of appointment via razorpay
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment cancelled or not found!" })
        }

        //creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }

        //creating order 
        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        console.log(orderInfo)

        if (orderInfo.status == 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        } else {
            res.json({ success: false, message: "Payment failed" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay, verifyEmail, sendVerifyOTP, verifyPhone, sendForgotOtp, setForgotPass }