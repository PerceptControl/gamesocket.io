import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import type { IDataEscort } from '../types/DataManager.js'

import { StringDecoder } from 'string_decoder'
import { v4 as uuid } from 'uuid'
import { EventManager } from '../EventManager/EventManager.js'
import { DataManager } from '../DataManager/DataManager.js'
import { ServerProxy } from '../ServerProxy/ServerProxy.js'

export class Behavior implements WebSocketBehavior {
  private static _decoder = new StringDecoder('utf8')
  constructor(private _manager: EventManager) {}

  public get open() {
    return async function (this: EventManager, socket: WebSocket) {
      if (typeof socket.id != 'string') socket.id = uuid()

      ServerProxy.pool.set(socket.id, socket)

      let open = this.get('open')
      if (open) {
        let escort = DataManager.spawn('open', { namespace: this.namespace, id: socket.id })
        open!.execute(escort)
        DataManager.drop(escort)
      } else {
        console.log(`${this.namespace}: open connection with socket#${socket.id}`)
      }
    }.bind(this._manager)
  }

  public get close() {
    return async function (this: EventManager, socket: WebSocket, code: number, message: ArrayBuffer) {
      ServerProxy.pool.delete(socket.id)

      if (this.get('close')) {
        let escort = DataManager.spawn('close', {
          namespace: this.namespace,
          id: socket.id,
          code: code,
          message: await Behavior.decode(message),
        })
        this.get('close')!.execute(escort)
        DataManager.drop(escort)
      } else {
        console.log(`${this.namespace}: close connection with socket#${socket.id}`)
      }
    }.bind(this._manager)
  }

  public get message() {
    return async function (this: EventManager, socket: WebSocket, message: ArrayBuffer, isBinary: boolean) {
      const parsedData = await Behavior.decode(message)
      const undefinedData = this.get('undefined data')
      const undefinedEvent = this.get('undefined event')

      let dataEscort: IDataEscort

      if (typeof parsedData == 'string') {
        dataEscort = DataManager.spawn('undefined data', { data: parsedData, id: socket.id })
        undefinedData?.execute(dataEscort)
      } else {
        if (parsedData.event) {
          dataEscort = DataManager.spawn(parsedData.event, { data: parsedData, id: socket.id })
          let eventEscort = this.get(parsedData.event)

          if (!eventEscort) undefinedEvent?.execute(dataEscort)
          else eventEscort.execute(dataEscort)
        } else {
          dataEscort = DataManager.spawn('unknown structure', { data: parsedData, id: socket.id })
          undefinedEvent?.execute(dataEscort)
        }

        DataManager.drop(dataEscort)
      }
    }.bind(this._manager)
  }

  public static async decode(message: unknown) {
    if (!(message instanceof ArrayBuffer)) throw Error('Socket message must be ArrayBuffer')
    else {
      let data = await this.fromBuffer(message)
      try {
        let parsedData = JSON.parse(data)
        return parsedData
      } catch (E) {
        return data
      }
    }
  }

  private static async fromBuffer(message: ArrayBuffer) {
    return Behavior._decoder.write(Buffer.from(message))
  }
}
