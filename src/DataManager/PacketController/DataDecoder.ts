import { StringDecoder } from 'string_decoder'
import { PacketStructure } from '../..'
import { DefaultPacketStructure } from '../PacketStructure.config'

//Конвертирует получаемые по сокетам данные в объект(ArrayBuffer to String)
export class DataDecoder {
  constructor() {}

  public getObject(socketData: ArrayBuffer): PacketStructure {
    let decodedData = this.toObject(socketData)
    if (this.isCorrect(decodedData)) {
      return decodedData
    } else throw new Error('Wrong packet format')
  }

  private isCorrect(decodedData: object): boolean {
    let keys = {
      config: Object.keys(DefaultPacketStructure),
      data: Object.keys(decodedData),
    }

    if (equals(keys.config, keys.data)) return true
    else return false
  }

  private toObject(socketData: unknown) {
    if (socketData instanceof ArrayBuffer)
      return JSON.parse(this.objectFromBuffer(socketData))
    else
      throw new Error(
        `Can't convert such data to object (converting ${socketData})`,
      )
  }

  private objectFromBuffer(bufferedData: ArrayBuffer): string {
    const decoder = new StringDecoder('utf8')
    return decoder.write(Buffer.from(bufferedData))
  }
}

function equals(a: Array<string>, b: Array<string>): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}
