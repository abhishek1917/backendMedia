// Mock auth service for testing without backend
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockUsers = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    fullname: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
]

export const mockAuthService = {
  async login(credentials) {
    await delay(1000) // Simulate network delay
    
    const { email, password } = credentials
    
    // Check demo credentials
    if ((email === 'demo@example.com' || email === 'demo') && password === 'demo123') {
      const user = mockUsers[0]
      return {
        data: {
          success: true,
          data: {
            user,
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token'
          },
          message: 'Login successful'
        }
      }
    }
    
    throw new Error('Invalid credentials')
  },

  async register(userData) {
    await delay(1500) // Simulate network delay
    
    const { fullname, username, email, password } = userData
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email || u.username === username)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      fullname,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
    
    mockUsers.push(newUser)
    
    return {
      data: {
        success: true,
        data: {
          user: newUser
        },
        message: 'Registration successful'
      }
    }
  },

  async getCurrentUser() {
    await delay(500)
    
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No token found')
    }
    
    return {
      data: {
        success: true,
        data: {
          user: mockUsers[0]
        }
      }
    }
  },

  async logout() {
    await delay(500)
    return {
      data: {
        success: true,
        message: 'Logout successful'
      }
    }
  },

  async refreshToken() {
    await delay(500)
    return {
      data: {
        success: true,
        data: {
          accessToken: 'new-mock-access-token'
        }
      }
    }
  }
}