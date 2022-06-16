import { dataObject, escortID, eventName, finalData, IEscort } from '../../types/DataManager'
import { PacketData } from './PacketData'

export class Escort implements IEscort {
  private _data: PacketData | undefined
  constructor(private _id: escortID, private _event: eventName, data?: finalData) {
    if (data) this._data = new PacketData(data)
  }

  public get(property?: string) {
    if (!property || !this.data) return this.data

    return this.getPropertyByPath(property)
  }

  public get event() {
    return this._event
  }

  public get id() {
    return this._id
  }

  public get data() {
    return this._data?.used
  }

  private getPropertyPath(propertyName: string) {
    if (!~propertyName.indexOf('/')) return -1 as -1
    else return propertyName.split('/')
  }

  private getPropertyByPath(propertyName: string) {
    if (!this.data) return undefined
    let tempData: finalData | dataObject = this.data

    if (typeof tempData != 'object') return tempData
    if (propertyName in tempData) return tempData[propertyName]

    let propertyPath = this.getPropertyPath(propertyName)
    if (propertyPath instanceof Array) {
      for (let part of propertyPath) {
        if (typeof tempData != 'object') return tempData
        if (part in tempData) {
          tempData = tempData[part]
        }
      }
    }

    return tempData
  }
}
