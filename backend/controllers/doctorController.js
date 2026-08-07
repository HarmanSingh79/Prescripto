import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
import validator from "validator"
import transporter from '../config/nodemailer.js'

//availability status can be changed by the both admin and the doctor
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: "Availability status changed!" })
    } catch (error) {
        res.json({ success: false, message: error.messge })
        console.log(error)

    }
}

const doctorsList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])//exclude password and email
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//login the doctor
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials!" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "Invalid credentials!" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//change doctor password (for logged in doctor)
// const changeDoctorPassword = async (req, res) => {
//     try {
//         const docId = req.docId;
//         const { oldPassword, newPassword } = req.body

//         if (!oldPassword || !newPassword) {
//             return res.json({ success: false, message: "Missing required fields!" })
//         }

//         if (!validator.isStrongPassword(newPassword, {
//             minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
//         })) {
//             return res.json({ success: false, message: "New password is not strong enough!" })
//         }

//         const doctor = await doctorModel.findById(docId);
//         if (!doctor) {
//             return res.json({ success: false, message: "Doctor not found!" })
//         }

//         const isMatch = await bcrypt.compare(oldPassword, doctor.password);
//         if (!isMatch) {
//             return res.json({ success: false, message: "Old password is incorrect!" })
//         }

//         const sameAsOld = await bcrypt.compare(newPassword, doctor.password);
//         if (sameAsOld) {
//             return res.json({ success: false, message: "New password must be different from old password!" })
//         }

//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(newPassword, salt)

//         doctor.password = hashedPassword
//         await doctor.save()

//         res.json({ success: true, message: "Password changed successfully!" })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

//send otp to reset password to doctor's registered email
const sendPassResetOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.json({ success: false, message: "Email is required!" })
        }

        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            // generic response so we don't reveal which emails exist
            return res.json({ success: true, message: "If this email is registered, an OTP has been sent" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        doctor.resetOtp = otp;
        doctor.resetOtpExpireAt = Date.now() + 10 * 60 * 1000 //10 minutes
        await doctor.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: doctor.email,
            subject: "Prescripto - Password Reset OTP",
            text: `Your OTP for resetting your Prescripto doctor account password is ${otp}. It is valid for 10 minutes. If you did not request this, please contact the admin.`
        }

        await transporter.sendMail(mailOptions)

        res.json({ success: true, message: "If this email is registered, an OTP has been sent" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//verify OTP and set new password
const resetDoctorPassword = async (req, res) => {
  try {
    const { email, oldPassword, otp, newPassword } = req.body
    if (!email || !oldPassword || !otp || !newPassword) {
      return res.json({ success: false, message: "Missing required fields" })
    }

    if (!validator.isStrongPassword(newPassword, {
      minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      return res.json({ success: false, message: "New password is not strong enough" })
    }

    const doctor = await doctorModel.findOne({ email })
    if (!doctor) {
      return res.json({ success: false, message: "Invalid email or OTP" })
    }

    const isMatch = await bcrypt.compare(oldPassword, doctor.password)
    if (!isMatch) {
      return res.json({ success: false, message: "Current password is incorrect" })
    }

    if (!doctor.resetOtp || doctor.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" })
    }

    if (doctor.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    doctor.password = hashedPassword
    doctor.resetOtp = ''
    doctor.resetOtpExpireAt = 0
    await doctor.save()

    res.json({ success: true, message: "Password reset successfully" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//get appointments for doctor
const apppointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to mark the appointment as completed
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: "Appointment Completed!" })
        } else {
            return res.json({ success: false, message: "Failed to complete the request." })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to cancel the appointment by doctor
const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment Cancelled!" })
        } else {
            return res.json({ success: false, message: "Cancellation failed." })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to get dashboard data
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId
        const appointments = await appointmentModel.find({ docId });
        let earnings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        })
        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to get doctor profile
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select("-password")
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to update the doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const { fees, address, available } = req.body
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: "Profile Updated!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { changeAvailability, doctorsList, loginDoctor, apppointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile,  resetDoctorPassword, sendPassResetOtp }