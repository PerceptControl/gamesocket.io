/**
 * Authored by Egor Dorofeichik
 * To communicate with me, please write to the sa1rac.work@gmail.com
 */

import { us_listen_socket, WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { RoomsController } from './EventSystem/RoomsController/RoomsController'
import { DataManager } from './DataManager/DataManager'

//API for use uWebSocket.js library in event style
export interface Server {
  pool: Map<string, Namespace>
  sockets: { [key: string]: boolean }

  //Returns new Namespace or setted Namespace from pool
  namespace(name: string): Namespace

  //Creates websocket server listener and sets all handlers
  listen(port: number, callback: (ls: us_listen_socket) => void): void

  //Returns Web socket if such uuid exists in server pool
  getSocket(id: string): WebSocket | undefined
}

//Abstraction for App().ws(namespace, behavior)
export interface Namespace {
  //Provides API to communicate with server sockets and rooms
  to(destination: Array<string> | string): RoomsController

  //Sets custom handler on selected event
  on(eventName: string, callback: any): void

  //Send event with data to all sockets connected to namespace
  emit(eventName: string, eventData?: object, eventMeta?: object): void

  //Returns status of selected socket connection with namespace
  has(id: string): boolean
}

//API which provides custom aliases to all sockets connected to server
//No methods implicitly modify internal data
export interface Aliases {
  set(socketId: string, socketAlias: string): boolean

  isSet(socketAlias: string): boolean

  getId(socketAlias: string): string | false

  swap(oldSocketAlias: string, newSocketAlias: string): boolean

  remove(socketAlias: string): boolean
}

//API which provides uuid(v4) parameter to all sockets connected to server
//No methods implicitly modify internal data
export interface Sockets {
  set(socketId: string, socket: WebSocket): void

  get(socketId: string): WebSocket | false

  remove(socketId: string): boolean
}

export interface PacketStructure {
  meta: packetInnerObject
  data: packetInnerObject
}

export type packetInnerObject = {
  [key: packetKey]: any
}

export type packetKey = string | number

//Definition of callback which used by Namespace.on('customEvevent')
export type messageHandler = (socketId: string, manager: DataManager) => void

//Definition of Namespace.to() arguments
export type Destination = {
  path: string | Array<string>
  type: 'path' | 'socket' | undefined
}

//Definition of data object variants which uses emit method
export type eventData =
  | []
  | [PacketStructure]
  | [packetInnerObject]
  | [packetInnerObject, packetInnerObject]

export type socketId = string
