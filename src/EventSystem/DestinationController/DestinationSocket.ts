import { eventData, socketId } from '../..'
import { WebSocket } from 'uWebSockets.js'
import { IDestinationSocket, actions, paths } from './Destinations'

import { validate } from 'uuid'
import { ServerProxy } from '../../ServerAPI/ServerProxy.js'
import Errors from '../../Errors.js'

export class DestinationSocket implements IDestinationSocket {
  private id: socketId
  constructor(destination: string, private callerName: string) {
    if (validate(destination)) this.id = destination
    else throw Error('Destination must be uuid string')
  }

  public emit(eventName: string, ...eventData: eventData): void {
    ServerProxy.emit(this.id, eventName, 'socket', ...eventData)
  }

  public join(rooms: paths): void {
    let socket = ServerProxy.getSocket(this.id)
    if (!socket) throw new Errors.Custom.socketExist(this.id)

    DestinationSocket.makeAction(socket, actions.JOIN, rooms, this.callerName)
  }

  public leave(rooms: paths): void {
    let socket = ServerProxy.getSocket(this.id)
    if (!socket) throw new Errors.Custom.socketExist(this.id)

    DestinationSocket.makeAction(socket, actions.LEAVE, rooms, this.callerName)
  }

  private static validateDestination(destination: paths, callerName: string) {
    if (destination instanceof Array) {
      destination.forEach((path, id, array) => {
        array[id] = DestinationSocket.getCorrectPath(path, callerName)
      })
    } else
      destination = [DestinationSocket.getCorrectPath(destination, callerName)]

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
    destination: paths,
    caller: string,
  ) {
    destination = DestinationSocket.validateDestination(destination, caller)
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
