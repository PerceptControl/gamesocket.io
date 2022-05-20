import { PacketController } from './PacketController/PacketController.js'
import { PacketFactory } from './PacketFactory/PacketFactory.js'
import { Packet } from './Packet/Packet.js'

export class DataManager {
  private controller = new PacketController()

  set packet(buffer: ArrayBuffer) {
    this.controller.setData(buffer)
  }

  get object() {
    return this.controller.getObject()
  }

  get string(): string {
    return this.controller.toString()
  }

  get(propPath: string) {
    return this.controller.get(propPath)
  }

  public static createPacket() {
    return PacketFactory.new()
  }

  public static toString(packet: Packet) {
    return JSON.stringify(packet.data)
  }
}
