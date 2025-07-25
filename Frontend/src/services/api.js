import axios from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/constants'
import { getFromStorage, removeFromStorage, setToStorage } from '@utils/storage'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = getFromStorage(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getFromStorage(STORAGE_KEYS.REFRESH_TOKEN)
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
          refreshToken
        })

        const { accessToken } = response.data.data
        setToStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN)
        removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN)
        removeFromStorage(STORAGE_KEYS.USER)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api