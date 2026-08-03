import React from 'react'
import {toast} from "react-toastify"

const PrivacyPolicy = () => {

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Copied successfully!")
        } catch (error) {
            toast.error("Could not copy")
        }
    }


    // ai generated (with some little changes)

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-gray-700 leading-7">
            <h1 className="text-2xl font-semibold mb-2 text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: August 3, 2026</p>

            <div className="space-y-6">
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Information we collect</h2>
                    <p>
                        We collect information you provide directly when you create an account, book appointments, or update your profile.
                        This may include your name, email address, phone number, profile photo, address, gender, date of birth, and
                        appointment history.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">How we use your information</h2>
                    <p>
                        We use your information to create and manage your account, schedule and track appointments, send verification
                        codes and service notifications, process payments, and improve the overall experience of the Prescripto platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-party services</h2>
                    <p>
                        We may share limited information with trusted third parties that help us operate the service. For example, Razorpay
                        is used to process online payments. If authentication providers such as Google or GitHub are added in the future,
                        they may also receive the information needed to complete sign-in.
                    </p>
                </section>

                {/* <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies and similar technologies</h2>
          <p>
            We may use cookies or similar technologies to keep you signed in, remember preferences, and improve site performance.
            You can control cookies through your browser settings, but some parts of the app may not work properly if cookies
            are disabled.
          </p>
        </section> */}

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Your rights</h2>
                    <p>
                        Depending on your location, you may have rights to access, update, or request deletion of your personal information.
                        You can also contact us if you believe any information we hold about you is inaccurate or incomplete.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, contact us at <span className='text-primary'><a onClick={() => copyToClipboard('prescriptobyharman@gmail.com')}
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=prescriptobyharman@gmail.com&su=Inquiry&body=Hello,"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='hover:text-black cursor-pointer'
                        >
                            prescriptobyharman@gmail.com
                        </a></span>
                    </p>
                </section>
            </div>
        </div>
    )
}

export default PrivacyPolicy
