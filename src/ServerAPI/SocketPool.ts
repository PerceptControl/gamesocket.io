import { WebSocket } from 'uWebSockets.js'

class Aliases {
  private static socketAliases: Map<string, string> = new Map()

  public static set(socketId: string, socketAlias: string) {
    if (Sockets.get(socketId)) this.socketAliases.set(socketAlias, socketId)
    else return false
    return true
  }

  public static change(oldSocketAlias: string, newSocketAlias: string) {
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

  public static getSocket(socketAlias: string) {
    var socketId = this.socketAliases.get(socketAlias)
    if (socketId) {
      var socket = Sockets.get(socketId)
      if (socket) return socket
      else {
        Sockets.remove(socketId)
        this.remove(socketAlias)
        return false
      }
    } else return false
  }

  public static getId(socketAlias: string) {
    var socketId = this.socketAliases.get(socketAlias)
    if (socketId) return socketId
    else return false
  }
}

class Sockets {
  private static sockets: Map<string, WebSocket> = new Map()

  public static get(id: string): WebSocket | undefined {
    return this.sockets.get(id)
  }

  public static add(id: string, socket: WebSocket) {
    this.sockets.set(id, socket)
  }

  public static remove(id: string) {
    this.sockets.delete(id)
  }
}

export default { Aliases, Sockets }
