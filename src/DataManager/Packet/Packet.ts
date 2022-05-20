import { PacketStructure as structure } from '../..'
import { DefaultPacketStructure } from '../PacketStructure.config.js'
import Errors from '../../Errors.js'

export class Packet {
  private packetObject: structure = DefaultPacketStructure

  set(propPath: string, propValue: any) {
    let path = parseDataPath(propPath)
    this.packetObject[path[0]][path[1]] = propValue
  }

  get(propPath: string) {
    let path = parseDataPath(propPath)
    return this.packetObject[path[0]][path[1]]
  }

  remove(propPath: string) {
    let path = parseDataPath(propPath)
    this.packetObject[path[0]][path[1]] = undefined
  }

  set object(newPacketObject: structure) {
    this.packetObject = newPacketObject
  }

  get data(): structure {
    return this.packetObject
  }
}

function parseDataPath(dataPath: string): ['meta' | 'data', string] {
  var path = dataPath.split('/')
  if ((path[0] === 'meta' || path[0] === 'data') && path.length === 2)
    return [path[0], path[1]]
  throw new Errors.Custom.path('segment(meta/data)/name', dataPath)
}
