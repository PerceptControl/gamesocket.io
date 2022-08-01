import type { eventName } from '../io'
import type { destination, IDestination } from '../DestinationConrtoller/DestinationConrtoller'
import type { finalData } from '../DataManager/DataManager'

import { EventHandler, EventManager } from '../EventManager/EventManager'
import DestinationConrtoller from '../DestinationConrtoller/DestinationConrtoller'
import logger from '../Logger/Logger.js'

export declare interface INamespace {
  control(destinations: destination | Array<destination>): IDestination
  emit(event: eventName, ...data: finalData[]): void
  on(event: eventName, callback: EventHandler): void
}

export class Namespace implements INamespace {
  constructor(private _name: string, private _events: EventManager) {}
  control(destinations: string | string[]): IDestination {
    if (logger.flags.debug) logger.debug(`${this._name}: controlling ${destinations}`)
    if (destinations instanceof Array) {
      if (destinations[0] == 'broadcast')
        logger.fatal(
          `{ ${this._name}.control('broadcast') } is reserved. Try to use { ${this._name}.emit(...) } instead`,
        )
      return DestinationConrtoller(this._name, ...destinations)
    } else {
      if (destinations == 'broadcast')
        logger.fatal(
          `{ ${this._name}.control('broadcast') } is reserved. Try to use { ${this._name}.emit(...) } instead`,
        )
      return DestinationConrtoller(this._name, destinations)
    }
  }

  emit(event: string, ...data: finalData[]): void {
    if (logger.flags.debug) logger.debug(`${this._name}: emitting '${event}'`)
    this.control('reserved/broadcast').emit(event, data)
  }

  on(event: string, callback: EventHandler): void {
    if (logger.flags.debug) logger.debug(`${this._name}: create handler "${event}"`)
    this._events.spawn(event, callback)
  }
}
