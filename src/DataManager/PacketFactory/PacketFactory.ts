import { Packet } from '../Packet/Packet.js'

export class PacketFactory {
  static new() {
    return new Packet()
  }
}
