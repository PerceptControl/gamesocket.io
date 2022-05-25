import { IAliasPool } from './IAliasPool'

export class AliasPool implements IAliasPool {
  private static aliases: Map<string, Array<string>> = new Map()
  set(socketAlias: string, id: string): void {
    let idArray = AliasPool.aliases.get(socketAlias)

    if (!idArray) AliasPool.aliases.set(socketAlias, [id])
    else idArray.push(id)
  }

  swap(oldSocketAlias: string, newSocketAlias: string): boolean {
    let buffer = AliasPool.aliases.get(oldSocketAlias)
    if (!buffer) return false

    AliasPool.aliases.delete(oldSocketAlias)
    AliasPool.aliases.set(newSocketAlias, buffer)
    return true
  }

  isSet(socketAlias: string): boolean {
    if (!AliasPool.aliases.get(socketAlias)) return false
    return true
  }

  get(socketAlias: string): Array<string> | undefined {
    return AliasPool.aliases.get(socketAlias)
  }

  getId(socketAlias: string, id: string): boolean {
    let buffer = AliasPool.aliases.get(socketAlias)
    if (!buffer) return false

    return buffer.includes(id)
  }

  remove(socketAlias: string): boolean {
    return AliasPool.aliases.delete(socketAlias)
  }

  delete(socketAlias: string, id: string): boolean {
    var buffer = AliasPool.aliases.get(socketAlias)
    if (!buffer) return false

    let index = buffer.indexOf(id)
    if (!~index) return false

    buffer.splice(index, 1)
    return true
  }
}
