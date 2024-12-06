import { vi } from 'vitest'
import { auth } from '../config/firebase'

// Mock Firebase auth
vi.mock('../config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com'
    }
  }
}))

// Mock fetch globally
global.fetch = vi.fn()

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})