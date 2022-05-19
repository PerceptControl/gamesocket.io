import { StringDecoder } from 'string_decoder'
var decoder = new StringDecoder('utf8')

//Converts binary socket data to object(ArrayBuffer to JSON)
export class DataDecoder {
  public getObject(socketData: unknown): unknown {
    return this.toObject(socketData)
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
    return decoder.write(Buffer.from(bufferedData))
  }
}
