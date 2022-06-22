import type { IDestination, IDestinationController } from '../types/DestinationController'
import type { roomName, socketID } from '../types'
import type { finalData } from '../types/DataManager'

import { validate } from 'uuid'
import { ServerProxy } from '../ServerProxy/ServerProxy.js'
import logger from '../Logger/Logger.js'

const controller: IDestinationController = function (namespace: string, ...destinations) {
  if (validate(destinations[0])) return new SocketDestination(namespace, destinations)
  else return new RoomDestination(namespace, destinations)
}

class SocketDestination implements IDestination {
  constructor(private _name: string, private _sockets: Array<socketID>) {
    _sockets.filter((id) => ServerProxy.has(id))
  }

  emit(event: string, ...data: finalData[]): void {
    for (let id in this._sockets) ServerProxy.send(id, event, ...data)
  }

  join(rooms: string | string[]): void {
    if (typeof rooms != 'string') {
      for (let id in this._sockets) {
        rooms.forEach((room, index) => (rooms[index] = getCorrectPath(room, this._name)))
        for (let room in rooms) ServerProxy.subscribe(id, room)
      }
    } else for (let id in this._sockets) ServerProxy.subscribe(id, rooms)
  }

  leave(rooms: string | string[]): void {
    if (typeof rooms != 'string') {
      for (let id in this._sockets) {
        rooms.forEach((room, index) => (rooms[index] = getCorrectPath(room, this._name)))
        for (let room in rooms) ServerProxy.unsubscribe(id, room)
      }
    } else for (let id in this._sockets) ServerProxy.unsubscribe(id, rooms)
  }
}

class RoomDestination implements IDestination {
  constructor(name: string, private _rooms: Array<roomName>) {
    _rooms.forEach((room, index) => {
      _rooms[index] = getCorrectPath(name, room)
    })
  }

  emit(event: string, ...data: finalData[]): void {
    for (let room in this._rooms) ServerProxy.emit(room, event, ...data)
  }

  join(socket: string | string[]): void {
    if (typeof socket != 'string') {
      for (let room in this._rooms) {
        for (let id in socket) ServerProxy.subscribe(id, room)
      }
    } else for (let room in this._rooms) ServerProxy.subscribe(socket, room)
  }

  leave(socket: string | string[]): void {
    if (typeof socket != 'string') {
      for (let room in this._rooms) {
        for (let id in socket) ServerProxy.unsubscribe(id, room)
      }
    } else for (let room in this._rooms) ServerProxy.unsubscribe(socket, room)
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
