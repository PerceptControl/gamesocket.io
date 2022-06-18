export declare type Handler<T> = (this: { id: escortID; name: eventName }, innerData: T) => void | Promise<void>

export declare type escortID = string
export declare type socketID = string

export declare type eventName = string
export declare type roomName = string

export declare interface IEscort<T> {
  get event(): eventName
  get id(): escortID
  get used(): T | undefined
}

export declare interface IManager<Escort> {
  spawn(event: eventName): Escort
  get(id: escortID): Escort | undefined
  drop(id: escortID): boolean
  drop(escort: Escort): boolean
}
