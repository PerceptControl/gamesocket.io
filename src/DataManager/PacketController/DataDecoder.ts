import { StringDecoder } from 'string_decoder'
import { PacketStructure } from '../StructureConfig'

//Конвертирует получаемые по сокетам данные в объект(ArrayBuffer to String)

export class DataDecoder {
  private decodedData: any
  constructor(private configObject: PacketStructure) {}

  public getObject(socketData: ArrayBuffer): PacketStructure {
    try {
      this.decodedData = this.toObject(socketData)
      if (this.isCorrect()) {
        return this.decodedData
      } else throw new Error('Wrong packet format')
    } catch (e) {
      throw e
    }
  }

  set config(configObject: PacketStructure) {
    this.configObject = configObject
  }

  private isCorrect(): boolean {
    let keys = {
      config: Object.keys(this.configObject),
      data: Object.keys(this.decodedData),
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
