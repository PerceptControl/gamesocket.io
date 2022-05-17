import { eventData } from '../..'
import { WsBehavior } from '../Behavior/Behavior.js'
import { RoomsController } from '../RoomsController/RoomsController.js'

export class Namespace {
  private spaceBehavior = new WsBehavior()
  public static pool: Map<string, Namespace> = new Map()
  public sockets: { [key: string]: boolean } = {}

  constructor(public name: string) {}

  to(destination: Array<string> | string) {
    if (destination == 'all' || destination == '#' || destination == '*')
      return new RoomsController('#', this.name)
    else return new RoomsController(destination, this.name)
  }

  on(eventName: string, callback: any) {
    switch (eventName) {
      case 'open':
        this.spaceBehavior.open = callback
      case 'close':
        this.spaceBehavior.close = callback
      default:
        this.spaceBehavior.set(eventName, callback)
    }
  }

  emit(eventName: string, ...eventData: eventData) {
    this.to('broadcast').emit(eventName, ...eventData)
  }

  has(id: string) {
    return this.sockets[id]
  }

  get behavior() {
    return this.spaceBehavior.Handler
  }
}
