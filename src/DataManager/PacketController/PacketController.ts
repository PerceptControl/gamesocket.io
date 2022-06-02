import { Packet } from '../Packet/Packet.js'
import { DataDecoder } from './DataDecoder.js'
import { PacketStructure } from '../..'

export class PacketController {
  private packet: Packet = new Packet()
  private decoder = new DataDecoder()

  setData(socketData: ArrayBuffer) {
    let packetObject = this.decoder.getObject(socketData)
    if (!objectIsPacketStructure(packetObject)) return false
    this.packet.object = packetObject
  }

  get(propPath: string) {
    return this.packet.get(propPath)
  }

  getObject() {
    return this.packet.object
  }

  toString() {
    return JSON.stringify(this.packet.object)
  }
}

function objectIsPacketStructure(object: any): object is PacketStructure {
  return 'meta' in object && 'data' in object
}
