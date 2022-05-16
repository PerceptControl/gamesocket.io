import { ServerProxy } from '../../ServerAPI/ServerProxy'
import { Destination, eventData } from '../..'

export class RoomsController {
  private destination: Destination = {
    path: String(),
    type: undefined,
  }

  constructor(destination: string | Array<string>, caller: string) {
    if (destination instanceof Array) {
      this.destination.path = new Array()
      for (let room of destination) {
        if (room == 'all' || room == '#' || room == '*' || room == caller) {
          this.destination.path = caller + '/#'
          break
        }
        room = room.startsWith(caller + '/') ? room : caller + '/' + room
        this.destination.path.push(room)
      }
    } else {
      if (isUUID(destination)) {
        this.destination.type = 'socket'
        this.destination.path = destination
      } else {
        this.destination.type = 'path'
        this.destination.path = destination.startsWith(caller + '/')
          ? destination
          : caller + '/' + destination
      }
    }
  }

  emit(eventName: string, ...eventData: eventData) {
    ServerProxy.emit(
      this.destination.path,
      eventName,
      this.destination.type,
      ...eventData,
    )
  }

  join(id: string) {
    let socket = ServerProxy.getSocket(id)
    if (!socket) return false
    if (this.destination.path instanceof Array) {
      for (var path of this.destination.path) socket.subscribe(path)
    } else socket.subscribe(this.destination.path)
    return true
  }

  leave(id: string) {
    let socket = ServerProxy.getSocket(id)
    if (!socket) return false
    if (this.destination.path instanceof Array) {
      for (var path of this.destination.path) socket.unsubscribe(path)
    } else socket.unsubscribe(this.destination.path)
    return true
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
