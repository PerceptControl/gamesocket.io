import { Packet } from '../Packet/Packet'

export class PacketFactory {
  static new() {
    return new Packet()
  }
}
