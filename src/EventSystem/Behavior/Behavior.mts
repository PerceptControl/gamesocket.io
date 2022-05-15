import { DataManager } from '../../DataManager/DataManager.mjs'
import uWS from 'uWebSockets.js'
import { runInThisContext } from 'vm'

export type openHandler = (socket: uWS.WebSocket) => void
export type closeHandler = (
  ws: uWS.WebSocket,
  code?: number,
  message?: ArrayBuffer,
) => void

export type customHandler = (socketId: string, manager: DataManager) => void

interface customBehavior {
  structure: uWS.WebSocketBehavior
  handlers: Map<string, any>
}

export class WsBehavior {
  private behavior: customBehavior = {
    structure: {
      compression: uWS.SHARED_COMPRESSOR,
      maxPayloadLength: 16 * 1024,
      maxBackpressure: 1024 * 64,
      idleTimeout: 16,
    },
    handlers: new Map(),
  }

  public manager: any
  public events: any

  constructor() {
    this.behavior.structure.message = this.messageHandler.bind({
      manager: new DataManager(),
      events: this.behavior.handlers,
    })
  }

  set open(callback: openHandler) {
    this.behavior.structure.open = callback
  }

  set close(callback: closeHandler) {
    this.behavior.structure.close = callback
  }

  set(eventName: string, callback: customHandler) {
    this.behavior.handlers.set(eventName, callback)
  }

  get Handler(): uWS.WebSocketBehavior {
    return this.behavior.structure
  }

  private messageHandler(userSocket: uWS.WebSocket, message: ArrayBuffer) {
    this.manager.packet = message
    var event = this.manager.get('meta/event')
    if (this.events.has(event))
      this.events.get(event)(userSocket.uuid, this.manager)
    else if (this.events.has('undefined event'))
      this.events.get('undefined event')(userSocket.uuid, event)
  }
}
