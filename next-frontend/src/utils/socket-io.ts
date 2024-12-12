import { BASE_URL } from '@/api/api'
import { io } from 'socket.io-client'

export const socket = io(`${BASE_URL}`, {
  autoConnect: false,
})