import api from './api'
import { mockAuthService } from './mockAuthService'
import { API_ENDPOINTS } from '../constants'

// Use mock service if backend is not available
const USE_MOCK = false // Set to false when backend is running

export const authService = {
  async login(credentials) {
    if (USE_MOCK) {
      return await mockAuthService.login(credentials)
    }
    
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  },

  async register(userData) {
    if (USE_MOCK) {
      return await mockAuthService.register(userData)
    }
    
    const formData = new FormData()
    Object.keys(userData).forEach(key => {
      if (userData[key] instanceof File) {
        formData.append(key, userData[key])
      } else if (userData[key] !== null) {
        formData.append(key, userData[key])
      }
    })

    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async logout() {
    if (USE_MOCK) {
      return await mockAuthService.logout()
    }
    
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    return response.data
  },

  async getCurrentUser() {
    if (USE_MOCK) {
      return await mockAuthService.getCurrentUser()
    }
    
    const response = await api.get(API_ENDPOINTS.AUTH.CURRENT_USER)
    return response.data
  },

  async refreshToken() {
    if (USE_MOCK) {
      return await mockAuthService.refreshToken()
    }
    
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    return response.data
  }
}









