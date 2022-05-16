import { Server } from '../Server'
import { eventData } from '..'
import { DataManager } from '../DataManager/DataManager'
import SocketPool from './SocketPool'

export class ServerEmitter {
  static toRoomPath(room: string, eventName: string, ...eventData: eventData) {
    var eventPacket = this.createPacket(eventName, ...eventData)
    Server.publish(room, DataManager.toString(eventPacket))
  }

  static toSocket(id: string, eventName: string, ...eventData: eventData) {
    var eventPacket = this.createPacket(eventName, ...eventData)
    var socket = SocketPool.Sockets.get(id)
    if (socket) socket.send(DataManager.toString(eventPacket), true, true)
  }

  static toGroup(
    rooms: Array<string>,
    eventName: string,
    ...eventData: eventData
  ) {
    var eventPacket = this.createPacket(eventName, ...eventData)
    for (var room of rooms) {
      Server.publish(room, DataManager.toString(eventPacket))
    }
  }

  private static createPacket(eventName: string, ...eventData: eventData) {
    var eventPacket = DataManager.createPacket()
    eventPacket.set('meta/event', eventName)
    switch (eventData.length) {
      case 0: {
        return eventPacket
      }

      case 1: {
        eventPacket.object = eventData[0]
        return eventPacket
      }

      case 2: {
        var data = eventData[0]
        var meta = eventData[1]

        for (var [key, value] of Object.entries(data))
          eventPacket.set(`data/${key}`, value)
        for (var [key, value] of Object.entries(meta))
          eventPacket.set(`meta/${key}`, value)
        return eventPacket
      }
    }
  }
}
