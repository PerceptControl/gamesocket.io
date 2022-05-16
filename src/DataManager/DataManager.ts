import { PacketController } from './PacketController/PacketController'
import { PacketFactory } from './PacketFactory/PacketFactory'
import { Packet } from './Packet/Packet'

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

  public static createPacket() {
    return PacketFactory.new()
  }

  public static toString(packet: Packet) {
    return JSON.stringify(packet.data)
  }
}
