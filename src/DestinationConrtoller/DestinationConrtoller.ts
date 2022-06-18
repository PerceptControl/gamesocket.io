import type { IDestination, IDestinationController } from '../types/DestinationController'
import type { roomName, socketID } from '../types'
import type { finalData } from '../types/DataManager'

import { validate } from 'uuid'
import { ServerProxy } from '../ServerProxy/ServerProxy.js'

const controller: IDestinationController = function (namespace: string, ...destinations) {
  if (validate(destinations[0])) return new SocketDestination(namespace, destinations)
  else return new RoomDestination(namespace, destinations)
}

class SocketDestination implements IDestination {
  constructor(private _name: string, private _sockets: Array<socketID>) {
    _sockets.filter((id) => ServerProxy.has(id))
  }

  emit(event: string, ...data: finalData[]): void {
    for (let id of this._sockets) ServerProxy.send(id, event, ...data)
  }

  join(rooms: string | string[]): void {
    if (typeof rooms != 'string') {
      for (let id of this._sockets) {
        rooms.forEach((room, index) => (rooms[index] = getCorrectPath(room, this._name)))
        for (let room of rooms) ServerProxy.subscribe(id, room)
      }
    } else for (let id of this._sockets) ServerProxy.subscribe(id, rooms)
  }

  leave(destination: string | string[]): void {
    if (typeof destination != 'string') {
      for (let id of this._sockets) {
        destination.forEach((room, index) => (destination[index] = getCorrectPath(room, this._name)))
        for (let room of destination) ServerProxy.unsubscribe(id, room)
      }
    } else for (let id of this._sockets) ServerProxy.unsubscribe(id, destination)
  }
}

class RoomDestination implements IDestination {
  constructor(name: string, private _rooms: Array<roomName>) {
    _rooms.forEach((room, index) => (_rooms[index] = getCorrectPath(room, name)))
  }

  emit(event: string, ...data: finalData[]): void {
    for (let room of this._rooms) ServerProxy.emit(room, event, ...data)
  }

  join(socket: string | string[]): void {
    if (typeof socket != 'string') {
      for (let room of this._rooms) {
        for (let id of socket) ServerProxy.subscribe(id, room)
      }
    } else for (let room of this._rooms) ServerProxy.subscribe(socket, room)
  }

  leave(socket: string | string[]): void {
    if (typeof socket != 'string') {
      for (let room of this._rooms) {
        for (let id of socket) ServerProxy.unsubscribe(id, room)
      }
    } else for (let room of this._rooms) ServerProxy.unsubscribe(socket, room)
  }
}

function getCorrectPath(name: string, path: string) {
  if (path == 'broadcast') throw Error(`${name}.control('broadcast') is reserved. Try to use ${name}.emit(...) instead`)
  if (path.startsWith(`${name}/`)) return path
  return `${name}/${path}`
}

export default controller
