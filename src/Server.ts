import uWS from 'uWebSockets.js'
import { v4 as uuid4 } from 'uuid'

import SocketPool from './ServerAPI/SocketPool.js'
import { Namespace } from './EventSystem/Namespace/Namespace.js'

import Errors from './Errors.js'
import { socketId } from './index.js'

type defaultOpenHandler = (
  this: { name: string },
  socket: uWS.WebSocket,
) => void | Promise<void>

type defaultCloseHandler = (
  socket: uWS.WebSocket,
  code?: number,
  message?: ArrayBuffer,
) => void | Promise<void>

class Server {
  public static wsServer = uWS.App()

  public static namespace(name: string): Namespace {
    Errors.Functions.isType.string('namespace', name)
    name.trim()
    if (name[0] === '/') name = name.substring(1)

    var namespace = Namespace.pool.get(name)
    if (!namespace) {
      namespace = new Namespace(name)
      Namespace.pool.set(name, namespace)
      namespace.onopen(Server.defaultOpen.bind({ name: name }))
      namespace.onclose(Server.defaultClose)
    }

    return namespace
  }

  public static listen(
    port: number,
    callback: (ls: uWS.us_listen_socket) => void,
  ) {
    for (let [name, space] of Namespace.pool) {
      Server.setHandler(name, space.behavior)
    }
    this.wsServer.listen(port, callback)
  }

  public static publish(room: string, event: string) {
    this.wsServer.publish(room, event, true, true)
  }

  public static attachIdToSocket(id: socketId, socket: uWS.WebSocket) {
    socket.id = id
    SocketPool.Sockets.set(socket.id, socket)
  }

  public static eraseSocket(socket: uWS.WebSocket) {
    try {
      if (socket.id && typeof socket.namespace == 'string')
        this.namespace(socket.namespace).sockets[socket.id] = false
      SocketPool.Sockets.remove(socket.id)
    } catch (e) {
      throw e
    }
  }

  public static setOpen(callback: defaultOpenHandler) {
    this.defaultOpen = callback
  }

  public static setClose(callback: defaultCloseHandler) {
    this.defaultClose = callback
  }

  private static setHandler(
    namespace: string,
    behavior: uWS.WebSocketBehavior,
  ) {
    this.wsServer.ws('/' + namespace, behavior)
  }

  private static defaultOpen: defaultOpenHandler = async function (
    this: { name: string },
    socket: uWS.WebSocket,
  ) {
    Server.attachIdToSocket(uuid4(), socket)
    Server.namespace(this.name).attach(socket)
  }

  private static defaultClose: defaultCloseHandler = async function (
    socket: uWS.WebSocket,
    code?: number,
  ) {
    console.log(
      `${socket.namespace}: socket ${socket.id} disconnected with code ${code}`,
    )
    Server.eraseSocket(socket)
  }
}

export { Server, SocketPool }
