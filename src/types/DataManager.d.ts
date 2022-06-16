export declare type escortID = string

export declare type eventName = string

export declare type finalData = string | number | boolean | dataObject

export declare type dataObject = { [key: string]: finalData }

export declare interface IEscort {
  get(property: string): finalData | undefined
  get event(): eventName
  get id(): escortID
  get data(): finalData | undefined
}
