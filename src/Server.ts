import uWS from 'uWebSockets.js'
import { v4 as uuid4 } from 'uuid'

import PoolController from './ServerAPI/PoolConrtoller/PoolController.js'
import { Namespace } from './EventSystem/Namespace/Namespace.js'

import Errors from './Errors.js'
import { socketId } from './index.js'

type openHandler = (this: { name: string }, socket: uWS.WebSocket) => void | Promise<void>

type closeHandler = (socket: uWS.WebSocket, code?: number, message?: ArrayBuffer) => void | Promise<void>

class Server {
  private static wsServer: uWS.TemplatedApp = uWS.App()
  private static customOpen: openHandler
  private static customClose: closeHandler

  public static namespace(name: string): Namespace {
    Errors.Functions.isType.string('namespace', name)
    name.trim()
    if (name[0] === '/') name = name.substring(1)

    var namespace = Namespace.pool.get(name)
    if (!namespace) {
      namespace = new Namespace(name)
      Namespace.pool.set(name, namespace)
      namespace.onopen(Server.serverOpen.bind({ name: name }))
      namespace.onclose(Server.serverClose)
    }

    return namespace
  }

  public static listen(port: number, callback: (ls: uWS.us_listen_socket) => void) {
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
    PoolController.Sockets.set(socket.id, socket)
  }

  public static eraseSocket(socket: uWS.WebSocket) {
    try {
      if (socket.id && typeof socket.namespace == 'string') this.namespace(socket.namespace).sockets[socket.id] = false
      PoolController.Sockets.remove(socket.id)
    } catch (e) {
      throw e
    }
  }

  public static set open(callback: openHandler) {
    this.customOpen = callback
  }

  public static set close(callback: closeHandler) {
    this.customClose = callback
  }

  private static setHandler(namespace: string, behavior: uWS.WebSocketBehavior) {
    this.wsServer.ws('/' + namespace, behavior)
  }

  private static serverOpen: openHandler = async function (this: { name: string }, socket: uWS.WebSocket) {
    Server.attachIdToSocket(uuid4(), socket)
    Server.namespace(this.name).attach(socket)
    Server.customOpen.call(this, socket)
  }

  private static serverClose: closeHandler = async function (
    socket: uWS.WebSocket,
    code?: number,
    message?: ArrayBuffer,
  ) {
    Server.customClose(socket, code, message)
    Server.eraseSocket(socket)
  }
}

export { Server, PoolController }
