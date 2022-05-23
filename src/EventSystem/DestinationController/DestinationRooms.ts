import { eventData } from '../..'
import { WebSocket } from 'uWebSockets.js'
import { IDestinationRooms, actions, destination } from './Destinations'

import { ServerProxy } from '../../ServerAPI/ServerProxy.js'
import { validate } from 'uuid'
import Errors from '../../Errors.js'

export class DestinationRooms implements IDestinationRooms {
  private destination: Array<string> = Array()
  constructor(destination: destination, private callerName: string) {
    if (!(destination instanceof Array))
      this.destination.push(
        DestinationRooms.getCorrectPath(destination, this.callerName),
      )
    else {
      destination.forEach((path) => {
        this.destination.push(
          DestinationRooms.getCorrectPath(path, this.callerName),
        )
      })
    }
  }

  public emit(eventName: string, ...eventData: eventData): void {
    ServerProxy.emit(this.destination, eventName, undefined, ...eventData)
  }

  public join(destination: destination) {
    var socketsIds = DestinationRooms.validateDestination(destination)
    for (let id of socketsIds) {
      let socket = ServerProxy.getSocket(id)
      if (!socket) throw new Errors.Custom.socketExist(id)

      DestinationRooms.makeAction(socket, actions.JOIN, this.destination)
    }
  }

  public leave(destination: destination) {
    var socketsIds = DestinationRooms.validateDestination(destination)
    for (let id of socketsIds) {
      let socket = ServerProxy.getSocket(id)
      if (!socket) throw new Errors.Custom.socketExist(id)

      DestinationRooms.makeAction(socket, actions.LEAVE, this.destination)
    }
  }

  private static validateDestination(destination: destination) {
    if (destination instanceof Array)
      destination = destination.filter((id) => validate(id))
    else {
      if (!validate(destination)) throw Error('Destination must be socket')
      destination = [destination]
    }

    return destination
  }

  private static getCorrectPath(uncheckedRoomPath: string, callerName: string) {
    return uncheckedRoomPath.startsWith(callerName + '/')
      ? uncheckedRoomPath
      : callerName + '/' + uncheckedRoomPath
  }

  private static async makeAction(
    socket: WebSocket,
    actionType: actions,
    destination: Array<string>,
  ) {
    switch (actionType) {
      case 'join':
        for (var path of destination)
          if (!socket.subscribe(path)) throw Error(`Can't subscribe to ${path}`)
        break
      case 'leave':
        for (var path of destination)
          if (!socket.unsubscribe(path))
            throw Error(`Can't subscribe to ${path}`)
        break
    }
  }
}
