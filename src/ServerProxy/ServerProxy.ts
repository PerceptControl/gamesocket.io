import type { TemplatedApp, WebSocket } from 'uWebSockets.js'
import type { eventName, roomName, socketID } from '../io'
import type { finalData } from '../DataManager/DataManager'

import logger from '../Logger/Logger.js'

export class ServerProxy {
  private static _sockets: Map<socketID, WebSocket>
  private static _app: TemplatedApp

  static emit(room: roomName, event: eventName, ...data: finalData[]): void {
    if (logger.flags.debug)
      logger.debug(`\t Trying to send as room '${room}' event ${event}. \n\tData: ${JSON.stringify(data)}`)
    this._app.publish(room, JSON.stringify({ event: event, used: data }), true, true)
  }

  static send(id: socketID, event: eventName, ...data: finalData[]): void {
    if (logger.flags.debug)
      logger.debug(`\t Trying to send as socket#${id} event ${event}. \n\tData: ${JSON.stringify(data)}`)

    const socket = this.get(id)
    if (socket) socket.send(JSON.stringify({ event: event, used: data }), true, true)
    else if (logger.flags.warn) logger.warn(`Called socket#${id} doesn't exist. Got event: '${event}'`)
  }

  static get(id: socketID) {
    return this._sockets.get(id)
  }

  static has(id: socketID): boolean {
    return this._sockets.has(id)
  }

  static subscribe(id: socketID, room: roomName): boolean {
    if (logger.flags.debug) logger.debug(`\tsocket#${id} joined room ${room}`)
    let socket = this.get(id)
    return socket ? socket.subscribe(room) : false
  }

  static unsubscribe(id: socketID, room: roomName): boolean {
    if (logger.flags.debug) logger.debug(`\tsocket#${id} leaved room ${room}`)
    let socket = this.get(id)
    return socket ? socket.unsubscribe(room) : false
  }

  static set pool(newPool: Map<socketID, WebSocket>) {
    this._sockets = newPool
  }

  static get pool() {
    return this._sockets
  }

  static set app(newApp: TemplatedApp) {
    if (logger.flags.debug) logger.debug(`\tApp setted to ${newApp}`)
    this._app = newApp
  }

  static get app() {
    return this._app
  }
}
