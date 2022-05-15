import { Server } from '../Server'
import { DataManager } from '../DataManager/DataManager'
import { WebSocket } from 'uWebSockets.js'

var manager = new DataManager()

export class ServerProxy {
  static emit(
    destination: string | Array<string>,
    eventName: string,
    eventData: object,
    eventMeta: object,
    destinationType?: string,
  ) {
    if (destination instanceof Array) {
      Emitter.toGroup(destination, eventName, eventData, eventMeta)
    } else {
      switch (destinationType) {
        case 'socket':
          Emitter.toSocket(destination, eventName, eventData, eventMeta)
          break
        case 'path':
          Emitter.toRoomPath(destination, eventName, eventData, eventMeta)
          break
      }
    }
  }

  static getSocket(id: string) {
    return Server.getSocket(id)
  }
  static addId(id: string, socket: WebSocket) {
    Server._addSocket(id, socket)
  }
  static removeId(id: string) {
    Server._removeSocket(id)
  }
}

class Emitter {
  static toRoomPath(
    destination: string,
    eventName: string,
    eventData: object,
    eventMeta: object,
  ) {
    var eventPacket = Emitter.createPacket(eventName, eventData, eventMeta)
    Server._publish(destination, DataManager.toString(eventPacket))
  }

  static toSocket(
    id: string,
    eventName: string,
    eventData: object,
    eventMeta: object,
  ) {
    var eventPacket = Emitter.createPacket(eventName, eventData, eventMeta)
    var socket = ServerProxy.getSocket(id)
    socket.send(DataManager.toString(eventPacket), true, true)
  }

  static toGroup(
    rooms: Array<string>,
    eventName: string,
    eventData: object,
    eventMeta: object,
  ) {
    var eventPacket = Emitter.createPacket(eventName, eventData, eventMeta)
    for (var room of rooms) {
      Server._publish(room, DataManager.toString(eventPacket))
    }
  }

  private static createPacket(
    eventName: string,
    eventData: object,
    eventMeta: object,
  ) {
    let eventPacket = DataManager.createPacket()
    eventPacket.set('meta/event', eventName)

    for (var [key, value] of Object.entries(eventData))
      eventPacket.set(`data/${key}`, value)
    for (var [key, value] of Object.entries(eventMeta))
      eventPacket.set(`meta/${key}`, value)
    return eventPacket
  }
}
