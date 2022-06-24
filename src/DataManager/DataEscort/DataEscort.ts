import type { dataObject, finalData, IDataEscort } from '../../types/DataManager'
import type { escortID, eventName } from '../../types'
import logger from '../../Logger/Logger.js'

export class DataEscort implements IDataEscort {
  private _data: finalData | undefined
  constructor(private _id: escortID, private _event: eventName, data?: finalData) {
    if (data != null) this._data = data
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
    return this._data
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
    if (logger.flags.debug) logger.debug(`escort#${this._id}: find property ${propertyName} in ${tempData}`)

    if (!this.isPrimitive) {
      if (propertyName in tempData) return tempData[propertyName]

      let propertyPath = this.getPropertyPath(propertyName)
      if (propertyPath) {
        let changeFlag = false
        for (let part of propertyPath.values()) {
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
