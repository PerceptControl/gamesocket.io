import type { dataObject, finalData, IDataEscort } from '../../types/DataManager'
import type { escortID, eventName } from '../../types'
import { PacketData } from './PacketData.js'

export class DataEscort implements IDataEscort {
  private _data: PacketData | undefined
  constructor(private _id: escortID, private _event: eventName, data?: finalData) {
    if (data) this._data = new PacketData(data)
  }

  public get(property?: string) {
    if (!property) return this.used

    return this.getPropertyByPath(property)
  }

  public get event() {
    return this._event
  }

  public get id() {
    return this._id
  }

  public get used() {
    return this._data?.used
  }

  public get isPrimitive() {
    return typeof this.used != 'object' && this.used != null
  }

  private getPropertyPath(propertyName: string) {
    if (~propertyName.indexOf('/')) return propertyName.split('/')
  }

  private getPropertyByPath(propertyName: string) {
    if (!this.used) return undefined
    let tempData: finalData | dataObject = this.used as dataObject

    if (!this.isPrimitive) {
      if (propertyName in tempData) return tempData[propertyName]

      let propertyPath = this.getPropertyPath(propertyName)
      if (propertyPath) {
        let changeFlag = false
        for (let part of propertyPath) {
          if (typeof tempData == 'object') {
            if (part in tempData) {
              tempData = tempData[part]
              changeFlag = true
            }
          }
        }
        return changeFlag ? tempData : undefined
      }
    }

    return undefined
  }
}
