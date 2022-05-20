import { WebSocket } from 'uWebSockets.js'
import { eventData } from '../..'
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
    else return new RoomsController(destination, this.name)
  }

  public on(eventName: string, callback: any) {
    switch (eventName) {
      case 'open':
        this.spaceBehavior.open = callback
      case 'close':
        this.spaceBehavior.close = callback
      default:
        this.spaceBehavior.set(eventName, callback)
    }
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
