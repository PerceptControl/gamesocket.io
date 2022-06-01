import { Server } from '../Server.js'
import { eventData, socketId } from '..'
import { DataManager } from '../DataManager/DataManager.js'
import SocketPool from './PoolConrtoller/PoolController.js'

export class ServerEmitter {
  static toSocket(id: socketId, eventName: string, eventData: eventData) {
    var eventPacket = this.createPacket(eventName, eventData)
    var socket = SocketPool.Sockets.get(id)
    if (socket) socket.send(DataManager.toString(eventPacket), true, true)
  }

  static toRoomArray(rooms: Array<string>, eventName: string, eventData: eventData) {
    var eventPacket = this.createPacket(eventName, eventData)
    for (var room of rooms) {
      Server.publish(room, DataManager.toString(eventPacket))
    }
  }

  private static createPacket(eventName: string, eventData: eventData) {
    var packet = DataManager.createPacket(eventData)
    packet.set('meta/event', eventName)
    return packet
  }
}
