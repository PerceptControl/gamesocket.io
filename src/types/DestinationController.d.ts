import { eventName, roomName, socketID } from '.'
import { finalData } from './DataManager'

export declare type IDestinationController = (...destinations: Array<destination>) => IDestination

export declare interface IDestination {
  emit(event: eventName, data: finalData | Array<finalData>): void
  join(destination: destination | Array<destination>): void
  leave(destination: destination | Array<destination>): void
}

export declare type destination = socketID | roomName
