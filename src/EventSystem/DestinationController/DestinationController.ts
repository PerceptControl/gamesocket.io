import { Destination, eventData, socketId } from '../..'

import { validate as uuidValidate } from 'uuid'
import { ServerProxy } from '../../ServerAPI/ServerProxy.js'
import { WebSocket } from 'uWebSockets.js'

const enum actions {
  JOIN = 'join',
  LEAVE = 'leave',
}

export class DestinationController {
  private destination: Destination = {
    path: String(),
    type: undefined,
  }

  constructor(destination: string | Array<string>, callerName: string) {
    if (destination instanceof Array) {
      this.setDestinationArray(destination, callerName)
    } else {
      if (uuidValidate(destination)) {
        this.setDestinationPath('socket', destination)
      } else {
        destination = DestinationController.getCorrectRoomPath(
          destination,
          callerName,
        )
        this.setDestinationPath('path', destination)
      }
    }
  }

  public emit(eventName: string, ...eventData: eventData) {
    ServerProxy.emit(
      this.destination.path,
      eventName,
      this.destination.type,
      ...eventData,
    )
  }

  public join(id: socketId) {
    let socket = ServerProxy.getSocket(id)
    if (!socket) return false

    this.makeAction(socket, actions.JOIN)
    return true
  }

  public leave(id: socketId) {
    let socket = ServerProxy.getSocket(id)
    if (!socket) return false

    this.makeAction(socket, actions.LEAVE)
    return true
  }

  private static getCorrectRoomPath(
    uncheckedRoomPath: string,
    callerName: string,
  ) {
    return uncheckedRoomPath.startsWith(callerName + '/')
      ? uncheckedRoomPath
      : callerName + '/' + uncheckedRoomPath
  }

  private makeAction(socket: WebSocket, actionType: actions) {
    switch (actionType) {
      case 'join':
        if (this.destination.path instanceof Array)
          for (var path of this.destination.path) socket.subscribe(path)
        else socket.subscribe(this.destination.path)
        break
      case 'leave':
        if (this.destination.path instanceof Array)
          for (var path of this.destination.path) socket.unsubscribe(path)
        else socket.unsubscribe(this.destination.path)
        break
    }
  }

  private setDestinationArray(
    destinationArray: Array<string>,
    callerName: string,
  ) {
    this.destination.path = Array()
    for (let path of destinationArray) {
      path = DestinationController.getCorrectRoomPath(path, callerName)
      this.destination.path.push(path)
    }
  }

  private setDestinationPath(type: 'path' | 'socket', path: string) {
    this.destination.type = type
    this.destination.path = path
  }
}
