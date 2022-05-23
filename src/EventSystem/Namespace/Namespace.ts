import { eventData, socketId } from '../..'
import { WebSocket } from 'uWebSockets.js'
import { DataManager } from '../../DataManager/DataManager'

import { WsBehavior } from '../Behavior/Behavior.js'
import { DestinationController } from '../DestinationController/DestinationController.js'
import { destination } from '../DestinationController/Destinations'

export class Namespace {
  private spaceBehavior = new WsBehavior()
  public static pool: Map<string, Namespace> = new Map()
  public sockets: { [key: string]: boolean } = {}

  constructor(public name: string) {}

  public control(destination: destination) {
    if (destination == 'all' || destination == '#' || destination == '*')
      return new DestinationController('#', this.name)
    return new DestinationController(destination, this.name)
  }

  public onopen(callback: (socket: WebSocket) => void | Promise<void>) {
    this.spaceBehavior.open = callback
  }

  public onclose(callback: (socket: WebSocket, code?: number, message?: ArrayBuffer) => void | Promise<void>) {
    this.spaceBehavior.close = callback
  }

  public on(eventName: string, callback: (id?: socketId, manager?: DataManager) => void | Promise<void>) {
    this.spaceBehavior.set(eventName, callback)
  }

  public emit(eventName: string, ...eventData: eventData) {
    this.control('broadcast').emit(eventName, ...eventData)
  }

  public attach(socket: WebSocket) {
    socket.namespace = this.name
    this.control('broadcast').join(socket.id)
    this.sockets[socket.uuid] = true
  }

  public has(id: any) {
    return this.sockets[id]
  }

  get behavior() {
    return this.spaceBehavior.Handler
  }
}
