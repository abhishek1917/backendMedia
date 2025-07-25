import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@store/slices/authSlice'
import { ROUTES } from '@/constants'

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-primary-600">
            VideoTube
          </Link>
          
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD} className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link to={ROUTES.PROFILE} className="text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <span className="text-gray-700">Hi, {user?.fullname}</span>
                <button 
                  onClick={handleLogout}
                  className="btn-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header