import { Packet } from '../Packet/Packet'
import { PacketStructureConfig } from '../StructureConfig'

export class PacketFactory {
  static new() {
    return new Packet(PacketStructureConfig)
  }
}
