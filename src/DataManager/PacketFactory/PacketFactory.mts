import { Packet } from '../Packet/Packet.mjs'
import { PacketStructureConfig } from '../StructureConfig.mjs'

export class PacketFactory {
  static new() {
    return new Packet(PacketStructureConfig)
  }
}
