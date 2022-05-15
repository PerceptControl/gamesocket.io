import { PacketController } from './PacketController/PacketController.mjs'
import { PacketFactory } from './PacketFactory/PacketFactory.mjs'
import { Packet } from './Packet/Packet.mjs'

export class DataManager {
  private controller = new PacketController()

  set packet(buffer: ArrayBuffer) {
    this.controller.setData(buffer)
  }

  get data(): string {
    return this.controller.toString()
  }

  get(propPath: string) {
    return this.controller.get(propPath)
  }

  static toString(packet: Packet) {
    return JSON.stringify(packet.data)
  }

  static createPacket() {
    return PacketFactory.new()
  }
}
