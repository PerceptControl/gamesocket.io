import { escortID, eventName, IEscort, IManager } from '.'

export declare type finalData = string | number | boolean | dataObject

export declare type dataObject = { [key: string]: finalData }

export declare interface IDataEscort extends IEscort<finalData> {
  get(property: string): finalData | undefined
  get isPrimitive(): boolean
}

export declare abstract class IDataManager {
  static spawn(event: eventName, data?: finalData): IDataEscort
  static get(id: escortID): IDataEscort | undefined
  static drop(id: escortID): boolean
  static drop(escort: IDataEscort): boolean
}
