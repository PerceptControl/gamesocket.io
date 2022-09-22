import type { us_listen_socket, WebSocket } from 'uWebSockets.js'
import type { AppOptions, TemplatedApp } from 'uWebSockets.js'

import uWS from 'uWebSockets.js'
import { Behavior } from './Behavior/Behavior.js'
import { EventManager } from './EventManager/EventManager.js'
import { Namespace } from './Namespace/Namespace.js'
import { ServerProxy } from './ServerProxy/ServerProxy.js'
import { AliasPool } from './AliasPool/AliasPool.js'
import logger from './Logger/Logger.js'
import { NmspManager } from './Namespace/Manager.js'

export declare type Handler<T> = (this: { id: escortID; name: eventName }, innerData: T) => void | Promise<void>

export declare type escortID = string
export declare type socketID = string

export declare type eventName = string
export declare type roomName = string

export declare interface IEscort<T> {
  get event(): eventName
  get id(): escortID
  get used(): T | undefined
}

export declare interface IManager<Escort> {
  spawn(event: eventName): Escort
  get(id: escortID): Escort | undefined
  drop(id: escortID): boolean
  drop(escort: Escort): boolean
}

const sockets: Map<socketID, WebSocket> = new Map()
ServerProxy.pool = sockets

function of(name: string): Namespace {
  return NmspManager.get(name)
}

function listen(port: number, callback: (ls: us_listen_socket) => void) {
  for (let space of NmspManager.spaces) {
    if (!space) continue
    ServerProxy.app.ws(`/${space.name}`, new Behavior(space?.Events))
  }
  ServerProxy.app.listen(port, callback)
}

export default function (options?: AppOptions): {
  app: TemplatedApp
  sockets: Map<string, WebSocket>
  of: typeof of
  listen: typeof listen
  aliases: AliasPool
  logger: typeof logger
} {
  if (!options) ServerProxy.app = uWS.App()
  else {
    if (options.cert_file_name && options.key_file_name) {
      ServerProxy.app = uWS.SSLApp(options)
    } else ServerProxy.app = uWS.App(options)
  }

  return {
    app: ServerProxy.app,
    sockets: sockets,
    of: of,
    listen: listen,
    aliases: new AliasPool(),
    logger: logger,
  }
}

export * from './Behavior/Behavior.js'
export * from './EventManager/EventManager.js'
export * from './Namespace/Namespace.js'
export * from './ServerProxy/ServerProxy.js'
export * from './AliasPool/AliasPool.js'
export * from './DataManager/DataManager.js'
export * from './DataManager/DataEscort/DataEscort.js'
