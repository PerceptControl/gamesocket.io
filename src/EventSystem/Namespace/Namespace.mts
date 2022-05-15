import {
  closeHandler,
  customHandler,
  openHandler,
  WsBehavior,
} from '../Behavior/Behavior.mjs'
import { ServerProxy } from '../ServerProxy.mjs'
import { RoomsController } from '../RoomsController/RoomsController.mjs'

export class Namespace {
  static pool = new Map()
  public sockets: any = new Array()
  private spaceBehavior = new WsBehavior()

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

  emit(eventName: string, eventData: object = {}, eventMeta: object = {}) {
    ServerProxy.emit(this.name, eventName, 'path', eventData, eventMeta)
  }

  has(id: string) {
    return this.sockets[id]
  }

  get behavior() {
    return this.spaceBehavior.Handler
  }
}
