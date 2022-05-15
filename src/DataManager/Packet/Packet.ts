import { PacketStructure } from '../StructureConfig'

export class Packet {
  constructor(private packetObject: PacketStructure) {}

  set(propPath: string, propValue: any) {
    let path: Array<string> = parseDataPath(propPath)
    if (path.length !== 2) throw new PathError('segment/name', propPath)
    this.packetObject[path[0]][path[1]] = propValue
  }

  get(propPath: string) {
    let path: Array<string> = parseDataPath(propPath)
    if (path.length !== 2) throw new PathError('segment/name', propPath)
    return this.packetObject[path[0]][path[1]]
  }

  remove(propPath: string) {
    let path: Array<string> = parseDataPath(propPath)
    if (path.length !== 2) throw new PathError('segment/name', propPath)
    this.packetObject[path[0]][path[1]] = undefined
  }

  get data(): PacketStructure {
    return this.packetObject
  }
}

class PathError extends Error {
  constructor(configPath: string, getPath: string) {
    var errorMessage = `Path parameter shall be ${configPath}. Get ${getPath}`
    super(errorMessage)
  }
}

function parseDataPath(dataPath: string): Array<string> {
  return dataPath.split('/')
}
