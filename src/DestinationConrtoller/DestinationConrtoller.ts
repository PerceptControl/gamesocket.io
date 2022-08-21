import { validate } from 'uuid'
import { ServerProxy } from '../ServerProxy/ServerProxy.js'
import logger from '../Logger/Logger.js'

import type { eventName, roomName, socketID } from '../io.js'
import type { finalData } from '../DataManager/DataManager.js'

export declare type IDestinationController = (...destinations: Array<destination>) => IDestination

export declare interface IDestination {
  emit(event: eventName, data: finalData | Array<finalData>): void
  join(destination: destination | Array<destination>): void
  leave(destination: destination | Array<destination>): void
}

export declare type destination = socketID | roomName

const controller: IDestinationController = function (namespace: string, ...destinations) {
  if (validate(destinations[0])) return new SocketDestination(namespace, destinations as unknown as socketID[])
  else return new RoomDestination(namespace, destinations)
}

class SocketDestination implements IDestination {
  constructor(private _name: string, private _sockets: Array<socketID>) {
    _sockets.filter((id) => ServerProxy.has(id))
  }

  emit(event: string, ...data: finalData[]): void {
    for (let id of this._sockets.values()) ServerProxy.send(id, event, ...data)
  }

  join(rooms: string | string[]): void {
    if (typeof rooms != 'string') {
      for (let id of this._sockets.values()) {
        rooms.forEach((room, index) => (rooms[index] = getCorrectPath(room, this._name)))
        for (let room of rooms) ServerProxy.subscribe(id, room)
      }
    } else for (let id of this._sockets.values()) ServerProxy.subscribe(id, rooms)
  }

  leave(rooms: string | string[]): void {
    if (typeof rooms != 'string') {
      for (let id of this._sockets.values()) {
        rooms.forEach((room, index) => (rooms[index] = getCorrectPath(room, this._name)))
        for (let room of rooms) ServerProxy.unsubscribe(id, room)
      }
    } else for (let id of this._sockets.values()) ServerProxy.unsubscribe(id, rooms)
  }
}

class RoomDestination implements IDestination {
  constructor(name: string, private _rooms: Array<roomName>) {
    _rooms.forEach((room, index) => {
      _rooms[index] = getCorrectPath(name, room)
    })
  }

  emit(event: string, ...data: finalData[]): void {
    for (let room of this._rooms) ServerProxy.emit(room, event, ...data)
  }

  join(socket: socketID | socketID[]): void {
    if (typeof socket != 'string') {
      for (let room of this._rooms) {
        for (let id of socket) ServerProxy.subscribe(id, room)
      }
    } else for (let room of this._rooms) ServerProxy.subscribe(socket, room)
  }

  leave(socket: socketID | socketID[]): void {
    if (typeof socket != 'string') {
      for (let room of this._rooms) {
        for (let id of socket) ServerProxy.unsubscribe(id, room)
      }
    } else for (let room of this._rooms) ServerProxy.unsubscribe(socket, room)
  }
}

function getCorrectPath(name: string, path: string) {
  if (path == 'broadcast')
    logger.fatal(`{ ${name}.control('broadcast') } is reserved. Try to use { ${name}.emit(...) instead }`)
  else if (path == 'reserved/broadcast') return `${name}/broadcast`
  if (path.startsWith(`${name}/`)) return path
  return `${name}/${path}`
}

export default controller
