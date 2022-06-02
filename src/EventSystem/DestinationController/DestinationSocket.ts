import { eventData, socketId } from '../..'
import { WebSocket } from 'uWebSockets.js'
import { IDestinationSocket, actions, paths } from './Destinations'

import { validate } from 'uuid'
import { ServerProxy } from '../../ServerAPI/ServerProxy.js'
import Errors from '../../Errors.js'

export class DestinationSocket implements IDestinationSocket {
  private destination: Array<socketId> = []
  constructor(destination: Array<string> | string, private callerName: string) {
    if (destination instanceof Array) {
      destination.filter((id) => {
        validate(id)
      })
    } else destination = [destination]
    this.destination = destination
  }

  public emit(eventName: string, ...eventData: eventData): void {
    this.destination.forEach((id) => {
      ServerProxy.emit(id, eventName, ...eventData)
    })
  }

  public join(rooms: paths): void {
    this.destination.forEach((id) => {
      var socket = DestinationSocket.getSocket(id)
      DestinationSocket.makeAction(actions.JOIN, socket, rooms, this.callerName)
    })
  }

  public leave(rooms: paths): void {
    this.destination.forEach((id) => {
      var socket = DestinationSocket.getSocket(id)
      DestinationSocket.makeAction(actions.LEAVE, socket, rooms, this.callerName)
    })
  }

  private static getSocket(id: socketId) {
    var socket = ServerProxy.getSocket(id)
    if (!socket) throw new Errors.Custom.socketExist(id)
    return socket
  }

  private static validatePath(uncheckedRoomPath: string, callerName: string) {
    if (uncheckedRoomPath.startsWith(callerName + '/')) return uncheckedRoomPath
    return callerName + '/' + uncheckedRoomPath
  }

  private static validateDestination(destination: paths, callerName: string) {
    if (!(destination instanceof Array)) destination = [DestinationSocket.validatePath(destination, callerName)]
    else
      destination.forEach((path, id, array) => {
        array[id] = DestinationSocket.validatePath(path, callerName)
      })

    return destination
  }

  private static async makeAction(actionType: actions, socket: WebSocket, destination: paths, caller: string) {
    destination = DestinationSocket.validateDestination(destination, caller)
    switch (actionType) {
      case actions.JOIN:
        destination.forEach((path) => socket.subscribe(path))
        break
      case actions.LEAVE:
        destination.forEach((path) => socket.unsubscribe(path))
        break
    }
  }
}
