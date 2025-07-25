import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../../constants'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />
}

export default ProtectedRoute


