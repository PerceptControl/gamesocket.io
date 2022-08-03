import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import type { IDataEscort } from '../DataManager/DataEscort/DataEscort'
import type { EventManager } from '../EventManager/EventManager'

import { v4 as uuid, validate as isUUID } from 'uuid'
import { DataManager } from '../DataManager/DataManager.js'
import { ServerProxy } from '../ServerProxy/ServerProxy.js'
import logger from '../Logger/Logger.js'

export class Behavior implements WebSocketBehavior {
  constructor(private _manager: EventManager) {}

  public get open() {
    return async function (this: EventManager, socket: WebSocket) {
      if (isNot(socket.id, 'uuid')) socket.id = uuid()
      ServerProxy.pool.set(socket.id, socket)
      socket.subscribe(`${this.namespace}/broadcast`)

      if (logger.flags.info) logger.info(`${this.namespace}: open connection with socket#${socket.id}`)

      const openHandler = this.get('open')
      if (openHandler) {
        let escort = DataManager.spawn('open', { namespace: this.namespace, id: socket.id })
        await openHandler.execute(escort)
        DataManager.drop(escort)
      }
    }.bind(this._manager)
  }

  public get close() {
    return async function (this: EventManager, socket: WebSocket, code: number, message: ArrayBuffer) {
      ServerProxy.pool.delete(socket.id)

      if (logger.flags.info) logger.info(`${this.namespace}: close connection with socket#${socket.id}`)

      const closeHandler = this.get('close')
      if (closeHandler) {
        const data = {
          namespace: this.namespace,
          id: socket.id,
          code: code,
          message: DataManager.decode(message),
        }

        let escort = DataManager.spawn('close', data)

        await closeHandler.execute(escort)

        DataManager.drop(escort)
      }
    }.bind(this._manager)
  }

  public get message() {
    return async function (this: EventManager, socket: WebSocket, message: ArrayBuffer, isBinary?: boolean) {
      if (logger.flags.info) logger.info(`${this.namespace}: execute 'message' event with socket#${socket.id}`)

      const parsedData = DataManager.decode(message)
      let dataEscort: IDataEscort

      if (isNot(parsedData, 'object')) {
        if (logger.flags.warn) logger.warn(`Got undefined data:${parsedData} from socket#${socket.id}`)

        const undefinedDataHandler = this.get('undefined data')
        if (undefinedDataHandler) {
          dataEscort = DataManager.spawn('undefined data', {
            ...parsedData,
            socket_id: socket.id,
            namespace: this.namespace,
          })

          await undefinedDataHandler.execute(dataEscort)
        }
      } else {
        if (contains(parsedData, 'event')) {
          dataEscort = DataManager.spawn(parsedData.event, {
            ...parsedData,
            socket_id: socket.id,
            namespace: this.namespace,
          })
          const eventHandler = this.get(parsedData.event)

          if (eventHandler) await eventHandler.execute(dataEscort)
          else {
            const undefinedEventHandler = this.get('undefined event')

            if (logger.flags.warn) logger.warn(`Got undefined event '${parsedData.event}' from socket#${socket.id}`)

            if (undefinedEventHandler) await undefinedEventHandler.execute(dataEscort)
          }
        } else {
          dataEscort = DataManager.spawn('unknown structure', {
            ...parsedData,
            socket_id: socket.id,
            namespace: this.namespace,
          })
          const undefinedEventHandler = this.get('undefined event')

          if (logger.flags.warn)
            logger.warn(`Got undefined data object from socket#${socket.id}: ${JSON.stringify(parsedData)}`)

          if (undefinedEventHandler) await undefinedEventHandler.execute(dataEscort)
        }

        DataManager.drop(dataEscort)
      }
    }.bind(this._manager)
  }

  public get drain() {
    return async function (this: EventManager, socket: WebSocket) {
      if (logger.flags.debug) logger.debug(`Executing 'drain' event`)

      const drainHandler = this.get('drain')
      if (drainHandler) drainHandler.execute(DataManager.spawn('drain', { socket: socket }))
    }.bind(this._manager)
  }
}

function is(entity: unknown, type: string) {
  switch (type) {
    case 'uuid': {
      if (typeof entity != 'string') return false
      return isUUID(entity)
    }
    case 'object': {
      if (typeof entity == 'string') return false
      else return true
    }
  }
}

function isNot(entity: unknown, type: string) {
  return !is(entity, type)
}

function contains(object: Object, param: string) {
  return param in object
}
