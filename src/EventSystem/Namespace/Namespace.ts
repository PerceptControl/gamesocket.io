import { eventData, socketId } from '../..'
import { WebSocket } from 'uWebSockets.js'
import { DataManager } from '../../DataManager/DataManager'

import { WsBehavior } from '../Behavior/Behavior.js'
import { RoomsController } from '../RoomsController/RoomsController.js'

export class Namespace {
  private spaceBehavior = new WsBehavior()
  public static pool: Map<string, Namespace> = new Map()
  public sockets: { [key: string]: boolean } = {}

  constructor(public name: string) {}

  public to(destination: Array<string> | string) {
    if (destination == 'all' || destination == '#' || destination == '*')
      return new RoomsController('#', this.name)
    return new RoomsController(destination, this.name)
  }

  public onopen(callback: (socket: WebSocket) => void | Promise<void>) {
    this.spaceBehavior.open = callback
  }

  public onclose(
    callback: (
      socket: WebSocket,
      code?: number,
      message?: ArrayBuffer,
    ) => void | Promise<void>,
  ) {
    this.spaceBehavior.close = callback
  }

  public on(
    eventName: string,
    callback: (id?: socketId, manager?: DataManager) => void | Promise<void>,
  ) {
    this.spaceBehavior.set(eventName, callback)
  }

  public emit(eventName: string, ...eventData: eventData) {
    this.to('broadcast').emit(eventName, ...eventData)
  }

  public attach(socket: WebSocket) {
    socket.namespace = this.name
    this.to('broadcast').join(socket.id)
    this.sockets[socket.uuid] = true
  }

  public has(id: any) {
    return this.sockets[id]
  }

  get behavior() {
    return this.spaceBehavior.Handler
  }
}
