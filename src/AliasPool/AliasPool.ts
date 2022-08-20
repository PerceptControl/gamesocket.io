import { socketID } from '../io.js'

export declare abstract class IAliasPool {
  static set(socketAlias: string, id: socketID): void

  static swap(oldSocketAlias: string, newSocketAlias: string): boolean

  static isSet(socketAlias: string): boolean

  static get(socketAlias: string): Array<string> | undefined

  static getId(socketAlias: string, id: socketID): void

  static remove(socketAlias: string): boolean

  static delete(socketAlias: string, id: socketID): boolean
}

export class AliasPool implements IAliasPool {
  private static aliases: Map<string, Array<string>> = new Map()
  set(socketAlias: string, id: string): void {
    let idArray = AliasPool.aliases.get(socketAlias)

    if (!idArray) AliasPool.aliases.set(socketAlias, [id])
    else idArray.push(id)
  }

  swap(oldSocketAlias: string, newSocketAlias: string): boolean {
    let tmp = this.get(oldSocketAlias)
    if (!tmp) return false

    this.remove(oldSocketAlias)
    AliasPool.aliases.set(newSocketAlias, tmp)
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
    let tmpArray = AliasPool.aliases.get(socketAlias)
    if (!tmpArray) return false

    return tmpArray.includes(id)
  }

  remove(socketAlias: string): boolean {
    return AliasPool.aliases.delete(socketAlias)
  }

  delete(socketAlias: string, id: string): boolean {
    const buffer = AliasPool.aliases.get(socketAlias)
    if (!buffer) return false

    let index = buffer.indexOf(id)
    if (!~index) return false

    buffer.splice(index, 1)
    return true
  }
}
