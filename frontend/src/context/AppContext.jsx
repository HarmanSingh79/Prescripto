import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendURL = import.meta.env.VITE_BAKCEND_URL
    const [doctors, setDoctors] = useState([])

    const [userData, setUserData] = useState(false)

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendURL + "/api/doctor/list")
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendURL + "/api/user/get-profile", { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendURL,
        userData, setUserData,
        loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider