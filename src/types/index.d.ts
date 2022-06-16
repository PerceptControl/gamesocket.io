export declare type socketId = string

export declare type Handler<T extends Function> = (callback: T) => void | Promise<void>

export declare interface IBehavior {
  send(): void
  subscribe(topic: string): void
}
