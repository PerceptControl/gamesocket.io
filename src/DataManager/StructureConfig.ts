interface PacketStructure {
  [key: string]: { [key: string | number]: any }
}

const PacketStructureConfig: PacketStructure = {
  meta: {},
  data: {},
}

export { PacketStructure, PacketStructureConfig }
