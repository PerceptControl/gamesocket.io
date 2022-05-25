import { eventData, socketId } from '../..'
import { WebSocket } from 'uWebSockets.js'
import { IDestinationRooms, actions, destination } from './Destinations'

import { ServerProxy } from '../../ServerAPI/ServerProxy.js'
import { validate } from 'uuid'
import Errors from '../../Errors.js'

export class DestinationRooms implements IDestinationRooms {
  private destination: Array<string> = []
  constructor(destination: destination, private callerName: string) {
    if (!(destination instanceof Array))
      this.destination.push(DestinationRooms.validatePath(destination, this.callerName))
    else {
      destination.forEach((path) => {
        this.destination.push(DestinationRooms.validatePath(path, this.callerName))
      })
    }
  }

  public emit(eventName: string, ...eventData: eventData): void {
    ServerProxy.emit(this.destination, eventName, ...eventData)
  }

  public join(destination: destination) {
    var sockets = DestinationRooms.validateDestination(destination)
    this.chooseAction(sockets, actions.JOIN)
  }

  public leave(destination: destination) {
    var sockets = DestinationRooms.validateDestination(destination)
    this.chooseAction(sockets, actions.LEAVE)
  }

  private static validateDestination(destination: destination) {
    if (destination instanceof Array) destination = destination.filter((id) => validate(id))
    else {
      if (!validate(destination)) throw Error('Destination must be socket')
      destination = [destination]
    }

    return destination
  }

  private async chooseAction(sockets: Array<socketId>, actionType: actions) {
    for (let id of sockets) {
      let socket = ServerProxy.getSocket(id)
      if (!socket) throw new Errors.Custom.socketExist(id)

      DestinationRooms.makeAction(socket, actionType, this.destination)
    }
  }

  private static async makeAction(socket: WebSocket, actionType: actions, destination: Array<string>) {
    switch (actionType) {
      case actions.JOIN:
        destination.forEach((path) => socket.subscribe(path))
        break
      case actions.LEAVE:
        destination.forEach((path) => socket.unsubscribe(path))
        break
    }
  }

  private static validatePath(uncheckedRoomPath: string, callerName: string) {
    if (uncheckedRoomPath.startsWith(callerName + '/')) return uncheckedRoomPath
    return callerName + '/' + uncheckedRoomPath
  }
}
