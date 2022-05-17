import { ServerProxy } from '../../ServerAPI/ServerProxy'
import { Destination, eventData } from '../..'

export class RoomsController {
  private destination: Destination = {
    path: String(),
    type: undefined,
  }

  constructor(destination: string | Array<string>, callerName: string) {
    if (destination instanceof Array) {
      this.setDestinationArray(destination, callerName)
    } else {
      if (isUUID(destination)) {
        this.setDestinationPath('socket', destination)
      } else {
        destination = RoomsController.getCorrectRoomPath(
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

  public join(id: string) {
    let socket = ServerProxy.getSocket(id)
    if (!socket) return false
    if (this.destination.path instanceof Array) {
      for (var path of this.destination.path) socket.subscribe(path)
    } else socket.subscribe(this.destination.path)
    return true
  }

  public leave(id: string) {
    let socket = ServerProxy.getSocket(id)
    if (!socket) return false
    if (this.destination.path instanceof Array) {
      for (var path of this.destination.path) socket.unsubscribe(path)
    } else socket.unsubscribe(this.destination.path)
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

  private setDestinationArray(
    destinationArray: Array<string>,
    callerName: string,
  ) {
    this.destination.path = Array()
    for (let path of destinationArray) {
      path = RoomsController.getCorrectRoomPath(path, callerName)
      this.destination.path.push(path)
    }
  }

  private setDestinationPath(type: 'path' | 'socket', path: string) {
    this.destination.type = type
    this.destination.path = path
  }
}

function isUUID(s: string) {
  var match = s.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )

  if (match) {
    return match.input == s
  }
  return false
}
