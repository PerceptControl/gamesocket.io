import { eventData, socketId } from '../..'

export type destination = string | Array<string>
export type paths = string | Array<string>

export const enum actions {
  JOIN = 'join',
  LEAVE = 'leave',
}

export interface IDestinationController {
  destination: IDestination
  emit(eventName: string, ...eventData: eventData): void
  join(id: socketId): void
  leave(id: socketId): void
}

export interface IDestination {
  emit(eventName: string, ...eventData: eventData): void
  join(destination: string | Array<string>): void
  leave(destination: string | Array<string>): void
}

export interface IDestinationSocket extends IDestination {
  emit(eventName: string, ...eventData: eventData): void
  join(destination: destination): void
  leave(destination: destination): void
}

export interface IDestinationRooms extends IDestination {
  emit(eventName: string, ...eventData: eventData): void
  join(destination: paths): void
  leave(id: paths): void
}
