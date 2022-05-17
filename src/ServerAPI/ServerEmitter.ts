import { Server } from '../Server.js'
import { eventData, packetInnerObject, PacketStructure } from '..'
import { DataManager } from '../DataManager/DataManager.js'
import SocketPool from './SocketPool.js'

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
    switch (eventData.length) {
      case 0: {
        eventPacket.set('meta/event', eventName)
        return eventPacket
      }

      case 1: {
        let data = eventData[0]
        if (isObjectPacketStructure(data)) {
          eventPacket.object = data
          eventPacket.set('meta/event', eventName)
          return eventPacket
        } else {
          eventPacket.set('meta/event', eventName)
          copyPacketFromEntries(eventPacket, data)
        }
        return eventPacket
      }

      case 2: {
        let data = eventData[0]
        let meta = eventData[1]

        eventPacket.set('meta/event', eventName)
        copyPacketFromEntries(eventPacket, data)
        copyPacketFromEntries(eventPacket, meta, 'meta')
        return eventPacket
      }
    }
  }
}

function copyPacketFromEntries(
  packet: { set(name: string, data: any): void },
  eventObject: packetInnerObject,
  propertyName: 'meta' | 'data' = 'data',
) {
  for (var [key, value] of Object.entries(eventObject))
    packet.set(`${propertyName}/${key}`, value)
}

function isObjectPacketStructure(object: any): object is PacketStructure {
  return 'meta' in object || 'data' in object
}
