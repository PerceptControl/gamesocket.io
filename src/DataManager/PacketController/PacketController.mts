import { Packet } from '../Packet/Packet.mjs'
import { PacketStructure, PacketStructureConfig } from '../StructureConfig.mjs'
import { DataDecoder } from './DataDecoder.mjs'

export class PacketController {
  private packet = new Packet(PacketStructureConfig)
  private decoder = new DataDecoder(PacketStructureConfig)

  setData(socketData: ArrayBuffer) {
    let packetObject = this.decoder.getObject(socketData)
    this.packet = new Packet(packetObject)
  }

  set config(newConfig: PacketStructure) {
    this.decoder.config = newConfig
  }

  get(propPath: string) {
    return this.packet.get(propPath)
  }

  toString() {
    return JSON.stringify(this.packet.data)
  }
}