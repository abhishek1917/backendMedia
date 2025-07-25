import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { STORAGE_KEYS } from '../../constants'
import { setToStorage, removeFromStorage, getFromStorage } from '../../utils/storage'
import toast from 'react-hot-toast'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage(STORAGE_KEYS.ACCESS_TOKEN)
      if (!token) return null
      
      const response = await authService.getCurrentUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user')
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.isAuthenticated = true
      setToStorage(STORAGE_KEYS.USER, user)
      setToStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      if (refreshToken) {
        setToStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      removeFromStorage(STORAGE_KEYS.USER)
      removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN)
      removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN)
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.isAuthenticated = true
        
        setToStorage(STORAGE_KEYS.USER, action.payload.data.user)
        setToStorage(STORAGE_KEYS.ACCESS_TOKEN, action.payload.data.accessToken)
        setToStorage(STORAGE_KEYS.REFRESH_TOKEN, action.payload.data.refreshToken)
        
        toast.success('Login successful!')
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        toast.success('Registration successful! Please login.')
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        removeFromStorage(STORAGE_KEYS.USER)
        removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN)
        removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN)
        toast.success('Logged out successfully!')
      })
      
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.data.user
          state.isAuthenticated = true
        }
      })
  }
})

export const { clearError, setCredentials, logout } = authSlice.actions
export default authSlice.reducer







