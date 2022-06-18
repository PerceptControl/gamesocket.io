import type { eventName } from '../types'
import type { destination, IDestination } from '../types/DestinationController'
import type { finalData } from '../types/DataManager'

import { EventHandler, EventManager } from '../EventManager/EventManager.js'
import DestinationConrtoller from '../DestinationConrtoller/DestinationConrtoller.js'
export declare interface INamespace {
  control(...destinations: Array<destination>): IDestination
  emit(event: eventName, ...data: finalData[]): void
  on(event: eventName, callback: EventHandler): void
}

export class Namespace implements INamespace {
  constructor(private _name: string, private _events: EventManager) {}
  control(...destinations: string[]): IDestination {
    if (destinations[0] != 'broadcast')
      throw Error(`${this._name}.control('broadcast') is reserved. Try to use ${this._name}.emit(...) instead`)
    return DestinationConrtoller(this._name, ...destinations)
  }

  emit(event: string, ...data: finalData[]): void {
    this.control('broadcast').emit(event, data)
  }

  on(event: string, callback: EventHandler): void {
    this._events.spawn(event, callback)
  }
}
