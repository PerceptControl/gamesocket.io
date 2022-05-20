import { WebSocket } from 'uWebSockets.js'
import { eventData, socketId } from '..'
import { ServerEmitter } from './ServerEmitter.js'
import SocketPool from './SocketPool.js'

export class ServerProxy {
  public static emit(
    destination: string | Array<string>,
    eventName: string,
    destinationType?: string,
    ...eventData: eventData
  ) {
    if (destination instanceof Array) {
      ServerEmitter.toRoomArray(destination, eventName, ...eventData)
    } else {
      switch (destinationType) {
        case 'socket':
          ServerEmitter.toSocket(destination, eventName, ...eventData)
          break
        case 'path':
          ServerEmitter.toRoomPath(destination, eventName, ...eventData)
          break
      }
    }
  }

  public static getSocket(id: socketId) {
    return SocketPool.Sockets.get(id)
  }
  public static addId(id: socketId, socket: WebSocket) {
    SocketPool.Sockets.set(id, socket)
  }
  public static removeId(id: socketId) {
    SocketPool.Sockets.remove(id)
  }
}
