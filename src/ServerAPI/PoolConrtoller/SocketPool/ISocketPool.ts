import { socketId } from '../../..'
import { WebSocket } from 'uWebSockets.js'

export interface ISocketPool {
  get(id: socketId): WebSocket | undefined

  set(id: socketId, socket: WebSocket): void | Promise<void>

  remove(id: socketId): boolean
}
