import type { IDataEscort } from './DataEscort/DataEscort.js'
import type { escortID, eventName } from '../io'

export declare type finalData = string | number | boolean | dataObject

export declare type dataObject = { [key: string]: finalData }

export declare abstract class IDataManager {
  static spawn(event: eventName, data?: finalData): IDataEscort
  static get(id: escortID): IDataEscort | undefined
  static drop(id: escortID): boolean
  static drop(escort: IDataEscort): boolean
}

import { v4 as uuid } from 'uuid'
import { DataEscort } from './DataEscort/DataEscort.js'
import { StringDecoder } from 'node:string_decoder'
import logger from '../Logger/Logger.js'
const decoder = new StringDecoder('utf8')

export class DataManager implements IDataManager {
  private static _escorts: Map<escortID, IDataEscort> = new Map()

  public static spawn(event: eventName, data?: finalData): IDataEscort {
    const newID = this.createID()

    let escort = new DataEscort(newID, event, data)
    this._escorts.set(newID, escort)

    if (logger.flags.trace) logger.trace(`Spawned escort with id "${newID}"\n\tInner data is: ${JSON.stringify(data)}`)
    return escort
  }

  public static get(id: string): IDataEscort | undefined {
    return this._escorts.get(id)
  }

  public static drop(entity: string | IDataEscort): boolean {
    if (typeof entity == 'string') return this._escorts.delete(entity)
    return this._escorts.delete(entity.id)
  }

  private static createID() {
    return uuid()
  }

  public static decode(buffer: ArrayBuffer) {
    if (!(buffer instanceof ArrayBuffer)) logger.fatal('Socket message must be ArrayBuffer')
    else {
      let data = decoder.write(Buffer.from(buffer))
      try {
        let jsonData = JSON.parse(data)
        return jsonData
      } catch (E) {
        return data
      }
    }
  }
}
