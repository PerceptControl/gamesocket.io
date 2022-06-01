import { WebSocket } from 'uWebSockets.js'
import { eventData, socketId } from '..'

import { ServerEmitter } from './ServerEmitter.js'
import SocketPool from './PoolConrtoller/PoolController.js'

export class ServerProxy {
  public static emit(destination: string | Array<string>, eventName: string, ...eventData: eventData) {
    if (!(destination instanceof Array)) ServerEmitter.toSocket(destination, eventName, eventData)
    else ServerEmitter.toRoomArray(destination, eventName, eventData)
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
