import { ServerProxy } from '../ServerProxy'

interface Destination {
  object: string | Array<string>
  type: string
}

export class RoomsController {
  private destination: Destination = {
    object: String(),
    type: String(),
  }

  constructor(destination: string | Array<string>, caller: string) {
    switch (typeof destination) {
      case 'string': {
        if (!isUUID(destination)) {
          this.destination.object = destination.startsWith(caller + '/')
            ? destination
            : caller + '/' + destination
          this.destination.type = 'path'
        } else {
          this.destination.object = destination
          this.destination.type = 'socket'
        }
        break
      }

      case 'object': {
        if (destination instanceof Array) {
          this.destination.object = new Array()
          this.destination.type = 'group'

          for (let room of destination) {
            room = room.startsWith(caller + '/') ? room : caller + '/' + room
            this.destination.object.push(room)
            if (room == 'all' || room == '#' || room == '*' || room == caller) {
              this.destination.object = caller + '/#'
              this.destination.type = 'path'
              break
            }
          }
        }
      }
    }
  }

  emit(eventName: string, eventData: object = {}, eventMeta: object = {}) {
    ServerProxy.emit(
      this.destination.object,
      eventName,
      eventData,
      eventMeta,
      this.destination.type,
    )
  }

  join(id: string) {
    let socket = ServerProxy.getSocket(id)
    switch (this.destination.type) {
      case 'group': {
        for (var path of this.destination.object) socket.subscribe(path)
        break
      }

      case 'path': {
        socket.subscribe(this.destination.object)
        break
      }

      default:
        break
    }
  }

  leave(id: string) {
    let socket = ServerProxy.getSocket(id)
    switch (this.destination.type) {
      case 'group': {
        for (var path of this.destination.object) socket.unsubscribe(path)
        break
      }

      case 'path': {
        socket.unsubscribe(this.destination.object)
        break
      }

      default:
        break
    }
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
