import uWS from 'uWebSockets.js'
import { Namespace } from './EventSystem/Namespace/Namespace'
import { v4 as uuid4 } from 'uuid'
import SocketPool from './ServerAPI/SocketPool'

var app = uWS.App()

export class Server {
  public static namespace(name: string): Namespace {
    isString('namespace', name)
    name.trim()
    if (name[0] === '/') name = name.substring(1)

    var namespace = Namespace.pool.get(name)
    if (!namespace) {
      namespace = new Namespace(name)
      Namespace.pool.set(name, namespace)
      namespace.on('open', Server.defaultOpen.bind(namespace))
      namespace.on('close', Server.defaultClose.bind(namespace))
    }

    return namespace
  }

  public static setHandler(namespace: string, behavior: uWS.WebSocketBehavior) {
    app.ws('/' + namespace, behavior)
  }

  public static listen(
    port: number,
    callback: (ls: uWS.us_listen_socket) => void,
  ) {
    for (let [name, space] of Namespace.pool) {
      this.setHandler(name, space.behavior)
    }
    app.listen(port, callback)
  }

  public static publish(room: string, event: string) {
    app.publish(room, event, true, true)
  }

  private static async defaultOpen(this: Namespace, socket: uWS.WebSocket) {
    if (socket.uuid) SocketPool.Sockets.add(socket.uuid, socket)
    else {
      socket.uuid = uuid4()
      SocketPool.Sockets.add(socket.uuid, socket)
    }

    socket.namespace = this.name
    Server.namespace(this.name).to('broadcast').join(socket.uuid)

    this.sockets[socket.uuid] = true
    console.log(`Socket ${socket.uuid} connected to ${this.name}`)
  }

  private static async defaultClose(
    this: Namespace,
    socket: uWS.WebSocket,
    code: number,
  ) {
    var uuid = socket.uuid
    if (uuid) this.sockets[uuid] = false
    SocketPool.Sockets.remove(socket.uuid)
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
