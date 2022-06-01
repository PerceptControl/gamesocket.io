import { PacketController } from './PacketController/PacketController.js'
import { PacketFactory } from './PacketFactory/PacketFactory.js'
import { Packet } from './Packet/Packet.js'
import { eventData, PacketStructure } from '../index.js'

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

  public static createPacket(data: eventData) {
    var packet = PacketFactory.new()
    var packetObject = packet.object
    switch (data.length) {
      case 1:
        if (!objectIsPacketStructure(data[0])) packetObject.data = data[0]
        else packet.object = data[0]
        break

      case 2:
        packetObject.data = data[0]
        packetObject.meta = data[1]
        break
    }
    return packet
  }

  public static toString(packet: Packet) {
    return JSON.stringify(packet.object)
  }
}

function objectIsPacketStructure(object: any): object is PacketStructure {
  return 'meta' in object || 'data' in object
}
