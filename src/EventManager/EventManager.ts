import type { escortID, eventName, Handler, IEscort, IManager } from '../io.js'
import type { IDataEscort } from '../DataManager/DataEscort/DataEscort.js'

import logger from '../Logger/Logger.js'
export declare type EventHandler = Handler<IDataEscort>

export class EventManager implements IManager<EventEscort> {
  private _escorts: Map<eventName, EventEscort> = new Map()
  constructor(public namespace: string) {}
  spawn(event: string, callback?: EventHandler): EventEscort {
    if (logger.flags.debug)
      logger.debug(`${this.namespace}(EventManager): spawning handler escort "${event}". \nCallback is ${callback}`)
    let escort = new EventEscort('_', event, callback)
    this._escorts.set(event, escort)

    return escort
  }

  get(entity: string | EventEscort): EventEscort | undefined {
    if (typeof entity == 'string') return this._escorts.get(entity)
    else return this._escorts.get(entity.event)
  }

  drop(entity: string | EventEscort) {
    if (typeof entity == 'string') return this._escorts.delete(entity)
    else return this._escorts.delete(entity.event)
  }

  get pool() {
    return this._escorts
  }
}

export class EventEscort implements IEscort<EventHandler> {
  private _handler: EventHandler
  constructor(private _id: escortID, private _event: eventName, callback?: EventHandler) {
    if (!callback)
      this._handler = function (this: { name: string; id: string }, escort: IDataEscort) {
        logger.fatal(`Unsetted function on event '${this.name}'`)
      }.bind({ id: this._id, name: this._event })
    else this._handler = callback.bind({ id: this._id, name: this._event })
  }

  public execute(escort: IDataEscort): void {
    this._handler.call({ id: this._id, name: this._event }, escort)
  }

  get used() {
    return this._handler
  }

  set used(callback: EventHandler) {
    this._handler = callback.bind({ id: this._id, name: this._event })
  }

  get id(): string {
    return this._id
  }

  get event(): string {
    return this._event
  }
}
