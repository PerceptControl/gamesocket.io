import type { finalData } from '../../types/DataManager'

export class PacketData {
  private _data: finalData | undefined
  constructor(data?: finalData) {
    if (data !== null) this._data = data
  }

  public get used() {
    return this._data
  }
}
