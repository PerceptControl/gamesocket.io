import { WebSocket } from 'uWebSockets.js'
import { socketId } from '..'

class Aliases {
  private static socketAliases: Map<string, string> = new Map()

  public static set(id: socketId, socketAlias: string) {
    if (Sockets.get(id)) {
      this.socketAliases.set(socketAlias, id)
      return true
    } else return false
  }

  public static isSet(socketAlias: string) {
    return this.socketAliases.has(socketAlias)
  }

  public static swap(oldSocketAlias: string, newSocketAlias: string) {
    var socketId = this.socketAliases.get(oldSocketAlias)
    if (socketId) {
      this.remove(oldSocketAlias)
      this.set(newSocketAlias, socketId)
      return true
    } else return false
  }

  public static remove(socketAlias: string) {
    return this.socketAliases.delete(socketAlias)
  }

  public static getId(socketAlias: string) {
    var socketId = this.socketAliases.get(socketAlias)
    if (socketId) return socketId
    else return false
  }
}

class Sockets {
  private static sockets: Map<string, WebSocket> = new Map()

  public static get(id: socketId): WebSocket | undefined {
    return this.sockets.get(id)
  }

  public static set(id: socketId, socket: WebSocket) {
    this.sockets.set(id, socket)
  }

  public static remove(id: socketId) {
    return this.sockets.delete(id)
  }
}

export default { Aliases, Sockets }
