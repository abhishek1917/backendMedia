import api from './api'
import { API_ENDPOINTS } from '@/constants'

export const userService = {
  async updateAccount(data) {
    const response = await api.patch(API_ENDPOINTS.USER.UPDATE_ACCOUNT, data)
    return response.data
  },

  async updateAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.patch(API_ENDPOINTS.USER.UPDATE_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async updateCoverImage(file) {
    const formData = new FormData()
    formData.append('coverImage', file)

    const response = await api.patch(API_ENDPOINTS.USER.UPDATE_COVER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async changePassword(data) {
    const response = await api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data)
    return response.data
  },

  async getChannelProfile(username) {
    const response = await api.get(`${API_ENDPOINTS.USER.CHANNEL_PROFILE}/${username}`)
    return response.data
  },

  async getWatchHistory() {
    const response = await api.get(API_ENDPOINTS.USER.WATCH_HISTORY)
    return response.data
  }
}