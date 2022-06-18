import type { TemplatedApp, WebSocket } from 'uWebSockets.js'
import type { eventName, roomName, socketID } from '../types'
import type { finalData } from '../types/DataManager'

export class ServerProxy {
  private static _sockets: Map<socketID, WebSocket>
  private static _app: TemplatedApp

  static emit(room: roomName, event: eventName, ...data: finalData[]): void {
    this._app.publish(room, JSON.stringify({ event: event, used: data }), true, true)
  }

  static send(id: socketID, event: eventName, ...data: finalData[]): void {
    this.get(id)?.send(JSON.stringify({ event: event, used: data }), true, true)
  }

  static get(id: socketID) {
    return this._sockets.get(id)
  }

  static has(id: socketID): boolean {
    return this._sockets.has(id)
  }

  static subscribe(id: socketID, room: roomName): boolean {
    let socket = this.get(id)
    return socket ? socket.subscribe(room) : false
  }

  static unsubscribe(id: socketID, room: roomName): boolean {
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
    this._app = newApp
  }

  static get app() {
    return this._app
  }
}
