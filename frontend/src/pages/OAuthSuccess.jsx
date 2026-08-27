import { useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams()
  const { setToken } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('token', token)
      setToken(token)
      toast.success("Logged in successfully")
      navigate('/')
    } else {
      toast.error("Login failed")
      navigate('/login')
    }
  }, [])

  return <div>Logging you in...</div>
}

export default OAuthSuccess