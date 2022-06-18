import type { escortID, eventName, Handler, IEscort, IManager } from '../types'
import type { IDataEscort } from '../types/DataManager'

export declare type EventHandler = Handler<IDataEscort>

export class EventManager implements IManager<EventEscort> {
  private _escorts: Map<eventName, EventEscort> = new Map()
  constructor(public namespace: string) {}
  spawn(event: string, callback?: EventHandler): EventEscort {
    let escort = new EventEscort('', event, callback)
    this._escorts.set(event, escort)

    return escort
  }

  get(event: string): EventEscort | undefined {
    return this._escorts.get(event)
  }

  drop(entity: string | EventEscort) {
    if (typeof entity == 'string') return this._escorts.delete(entity)
    else return this._escorts.delete(entity.id)
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
        throw Error(`Unsetted function on event ${this.name}`)
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
