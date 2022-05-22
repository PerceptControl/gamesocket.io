import { Server } from '../Server.js'
import { eventData, PacketStructure, socketId } from '..'
import { DataManager } from '../DataManager/DataManager.js'
import SocketPool from './SocketPool.js'
import { DefaultPacketStructure } from '../DataManager/PacketStructure.config.js'

export class ServerEmitter {
  static toRoomPath(room: string, eventName: string, ...eventData: eventData) {
    var eventPacket = this.createPacket(eventName, ...eventData)
    Server.publish(room, DataManager.toString(eventPacket))
  }

  static toSocket(id: socketId, eventName: string, ...eventData: eventData) {
    var eventPacket = this.createPacket(eventName, ...eventData)
    var socket = SocketPool.Sockets.get(id)
    if (socket) socket.send(DataManager.toString(eventPacket), true, true)
  }

  static toRoomArray(
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
    var newPacketObject = DefaultPacketStructure
    switch (eventData.length) {
      case 0: {
        eventPacket.set('meta/event', eventName)
        return eventPacket
      }

      case 1: {
        let data = eventData[0]
        if (objectIsPacketStructure(data)) {
          data.meta['event'] = eventName
          eventPacket.object = data

          return eventPacket
        } else {
          newPacketObject.meta['event'] = eventName
          newPacketObject.data = data

          eventPacket.object = newPacketObject
        }
        return eventPacket
      }

      case 2: {
        newPacketObject.meta = { event: eventName, ...eventData[1] }
        newPacketObject.data = eventData[0]

        eventPacket.object = newPacketObject
        return eventPacket
      }
    }
  }
}

function objectIsPacketStructure(object: any): object is PacketStructure {
  return 'meta' in object || 'data' in object
}
