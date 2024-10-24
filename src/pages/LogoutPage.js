import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Clear session storage
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('pages')

    // Redirect to login page
    navigate('/')
  }, [navigate])

  return null // No need to render anything
}

export default LogoutPage
