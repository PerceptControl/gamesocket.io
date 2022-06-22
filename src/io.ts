import type { us_listen_socket, WebSocket } from 'uWebSockets.js'
import type { AppOptions } from 'uWebSockets.js'
import type { socketID } from './types'

import uWS from 'uWebSockets.js'
import { Behavior } from './Behavior/Behavior.js'
import { EventManager } from './EventManager/EventManager.js'
import { Namespace } from './Namespace/Namespace.js'
import { ServerProxy } from './ServerProxy/ServerProxy.js'
import logger from './Logger/Logger.js'

const sockets: Map<socketID, WebSocket> = new Map()
const spaces: Map<string, Namespace> = new Map()
const managers: Map<string, EventManager> = new Map()

ServerProxy.pool = sockets

function of(name: string): Namespace {
  let space: Namespace
  if (name.startsWith('/')) name = name.split('/')[1]
  if (!spaces.has(name)) {
    if (logger.flags.debug) logger.debug(`Created namespace "${name}"`)
    let manager = new EventManager(name)
    space = new Namespace(name, manager)

    managers.set(name, manager)
    spaces.set(name, space)

    return space
  }
  return spaces.get(name)!
}

function listen(port: number, callback: (ls: us_listen_socket) => void) {
  for (let name of spaces.keys()) {
    let events = managers.get(name) as EventManager
    ServerProxy.app.ws(`/${name}`, new Behavior(events))
  }
  ServerProxy.app.listen(port, callback)
}

export default function (options?: AppOptions) {
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
    logger: logger,
  }
}
