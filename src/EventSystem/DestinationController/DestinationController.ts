import { IDestination, destination, IDestinationController } from './Destinations'

import { DestinationRooms } from './DestinationRooms.js'
import { DestinationSocket } from './DestinationSocket.js'
import { validate } from 'uuid'
import { eventData } from '../..'

export class DestinationController implements IDestinationController {
  public destination: IDestination
  constructor(destination: destination, callerName: string) {
    if (destination instanceof Array) this.destination = new DestinationRooms(destination, callerName)
    else {
      if (validate(destination)) this.destination = new DestinationSocket(destination, callerName)
      else this.destination = new DestinationRooms(destination, callerName)
    }
  }

  emit(eventName: string, ...eventData: eventData): void {
    this.destination.emit(eventName, ...eventData)
  }

  join(destination: destination): void {
    this.destination.join(destination)
  }

  leave(destination: destination): void {
    this.destination.leave(destination)
  }
}
