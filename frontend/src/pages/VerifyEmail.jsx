import React, { useContext, useRef, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
    const navigate = useNavigate()
    const { verifyEmail, sendVerifyOtp, userData, token } = useContext(AppContext)

    const [otp, setOtp] = useState(new Array(6).fill(''))
    const inputRefs = useRef([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Runs every time the user types a digit into one of the 6 OTP boxes
    const handleChange = (event, boxIndex) => {
        const typedValue = event.target.value

        // Only allow numbers (block letters/symbols)
        const isNotANumber = isNaN(typedValue)
        if (isNotANumber) {
            return
        }

        // Update just this one box in our otp array, keep the rest unchanged
        const updatedOtp = [...otp]
        updatedOtp[boxIndex] = typedValue
        setOtp(updatedOtp)

        // If user typed something (not deleted) and we're not on the last box,
        // automatically jump to the next box
        const userTypedSomething = typedValue !== ''
        const notLastBox = boxIndex < 5
        if (userTypedSomething && notLastBox) {
            inputRefs.current[boxIndex + 1].focus()
        }
    }

    // Runs when user presses a key (we only care about Backspace here)
    const handleKeyDown = (event, boxIndex) => {
        const pressedBackspace = event.key === 'Backspace'
        const currentBoxIsEmpty = !otp[boxIndex]
        const notFirstBox = boxIndex > 0

        // If box is already empty and user hits Backspace, jump back to previous box
        if (pressedBackspace && currentBoxIsEmpty && notFirstBox) {
            inputRefs.current[boxIndex - 1].focus()
        }
    }

    // Runs when user pastes a 6-digit code instead of typing it manually
    const handlePaste = (event) => {
        const pastedText = event.clipboardData.getData('text')

        // Take only first 6 characters and split into an array of single digits
        const pastedDigits = pastedText.slice(0, 6).split('')

        // Make sure every character pasted is actually a number
        const allDigitsAreNumbers = pastedDigits.every(char => !isNaN(char))
        if (!allDigitsAreNumbers) {
            return
        }

        // Fill remaining empty boxes if pasted text was shorter than 6 digits
        const emptyBoxesNeeded = 6 - pastedDigits.length
        const emptyBoxes = Array(emptyBoxesNeeded).fill('')
        setOtp(pastedDigits.concat(emptyBoxes))

        // Manually update each input's visible value to match
        pastedDigits.forEach((digit, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = digit
            }
        })
    }

    // Runs when user clicks "Verify Email"
    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)

        // Combine the 6 separate boxes into one string, e.g. "123456"
        const fullOtp = otp.join('')

        const wasVerified = await verifyEmail(fullOtp)

        setIsSubmitting(false)

        if (wasVerified) {
            navigate('/my-profile')
        }
    }

    useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    if (userData?.isAccountVerified) {
      navigate('/my-profile')
      return
    }
    sendVerifyOtp()
  }, [])

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[70vh] flex items-center justify-center'>
            <div className='bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center gap-4 border border-gray-200'>
                <p className='text-2xl font-semibold text-gray-700'>Email Verification</p>
                <p className='text-sm text-gray-500 text-center'>
                    Enter the 6-digit code sent to your email
                </p>

                <div className='flex gap-2' onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className='w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:border-primary'
                        />
                    ))}
                </div>

                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-primary text-white w-full py-2.5 rounded-full mt-2 disabled:opacity-50'
                >
                    {isSubmitting ? 'Verifying...' : 'Verify Email'}
                </button>
            </div>
        </form>
    )
}

export default VerifyEmail