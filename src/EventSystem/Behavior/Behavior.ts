import { DataManager } from '../../DataManager/DataManager'
import uWS from 'uWebSockets.js'
import { messageHandler } from '../../index'

interface customBehavior {
  structure: uWS.WebSocketBehavior
  handlers: Map<string, messageHandler>
}

type openHandler = (socket: uWS.WebSocket) => void

type closeHandler = (
  ws: uWS.WebSocket,
  code?: number,
  message?: ArrayBuffer,
) => void

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

  set(eventName: string, callback: messageHandler) {
    this.behavior.handlers.set(eventName, callback)
  }

  get Handler(): uWS.WebSocketBehavior {
    return this.behavior.structure
  }

  private messageHandler(
    this: { manager: DataManager; events: Map<string, messageHandler> },
    userSocket: uWS.WebSocket,
    message: ArrayBuffer,
  ) {
    this.manager.packet = message
    var eventName: string = this.manager.get('meta/event')

    var eventHandler: messageHandler | undefined = this.events.get(eventName)
    var undefinedHandler: messageHandler | undefined =
      this.events.get('undefined event')
    if (eventHandler) eventHandler(userSocket.uuid, this.manager)
    else if (undefinedHandler) undefinedHandler(userSocket.uuid, this.manager)
  }
}