import uWS from 'uWebSockets.js'
import { Namespace } from './EventSystem/Namespace/Namespace.mjs'
import { v4 as uuid4 } from 'uuid'

var app = uWS.App()

export class Server {
  private static sockets: any = new Map()

  static namespace(name: string) {
    isString('namespace', name)
    name.trim()
    if (name[0] === '/') name = name.substring(1)

    var namespace

    if (Namespace.pool.has(name)) {
      namespace = Namespace.pool.get(name)
    } else {
      namespace = new Namespace(name)
      Namespace.pool.set(name, namespace)
      namespace.on('open', Server.defaultOpen.bind(namespace))
      namespace.on('close', Server.defaultClose.bind(namespace))
    }

    return namespace
  }

  static setHandler(namespace: string, behavior: uWS.WebSocketBehavior) {
    app.ws('/' + namespace, behavior)
  }

  static listen(port: number, callback: (ls: uWS.us_listen_socket) => void) {
    for (let [name, space] of Namespace.pool) {
      this.setHandler(name, space.behavior)
    }
    app.listen(port, callback)
  }

  static getSocket(id: string) {
    return Server.sockets.get(id)
  }

  static _addSocket(id: string, socket: uWS.WebSocket) {
    Server.sockets.set(id, socket)
  }

  static _removeSocket(id: string) {
    Server.sockets.delete(id)
  }

  static _publish(room: string, event: string) {
    app.publish(room, event, true, true)
  }

  private static async defaultOpen(socket: uWS.WebSocket) {
    if (socket.uuid) Server._addSocket(socket.uuid, socket)
    else {
      socket.uuid = uuid4()
      Server._addSocket(socket.uuid, socket)
    }

    socket.subscribe(this.name)
    socket.namespace = this.name

    this.sockets[socket.uuid] = true
    console.log(`Socket ${socket.uuid} connected to ${this.name}`)
  }

  private static async defaultClose(socket: uWS.WebSocket, code: number) {
    Server._removeSocket(socket.uuid)
    this.sockets[socket.uuid] = undefined
    console.log(`Socket ${socket.uuid} disconnected with code ${code}`)
  }
}

function isString(entity: any, value: unknown) {
  if (typeof value !== 'string')
    throw new TypeError(entity, 'string', typeof value)
}

class TypeError extends Error {
  constructor(entity: any, configType: string, getType: string) {
    var errorMessage = `${entity} shall have ${configType} type. Get ${getType}`
    super(errorMessage)
  }
}
