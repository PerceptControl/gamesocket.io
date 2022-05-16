import { Packet } from '../Packet/Packet'
import { DefaultPacketStructure } from '../PacketStructure.config'
import { DataDecoder } from './DataDecoder'

export class PacketController {
  private packet = new Packet()
  private decoder = new DataDecoder(DefaultPacketStructure)

  setData(socketData: ArrayBuffer) {
    let packetObject = this.decoder.getObject(socketData)
    this.packet = new Packet()
    this.packet.object = packetObject
  }

  get(propPath: string) {
    return this.packet.get(propPath)
  }

  toString() {
    return JSON.stringify(this.packet.data)
  }
}
