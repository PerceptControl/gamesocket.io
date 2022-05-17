import { Server } from '../Server'
import { WebSocket } from 'uWebSockets.js'
import { eventData } from '..'
import { ServerEmitter } from './ServerEmitter'
import SocketPool from './SocketPool'

export class ServerProxy extends Server {
  public static emit(
    destination: string | Array<string>,
    eventName: string,
    destinationType?: string,
    ...eventData: eventData
  ) {
    if (destination instanceof Array) {
      ServerEmitter.toGroup(destination, eventName, ...eventData)
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

  public static getSocket(id: string) {
    return SocketPool.Sockets.get(id)
  }
  public static addId(id: string, socket: WebSocket) {
    SocketPool.Sockets.set(id, socket)
  }
  public static removeId(id: string) {
    SocketPool.Sockets.remove(id)
  }
}
