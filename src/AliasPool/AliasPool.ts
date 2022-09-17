import { socketID } from '../io.js'

export declare abstract class IAliasPool {
  set(socketAlias: string, id: socketID): void

  swap(oldSocketAlias: string, newSocketAlias: string): boolean

  isSet(socketAlias: string): boolean

  get(socketAlias: string): Array<string> | undefined

  getId(socketAlias: string, id: socketID): void

  remove(socketAlias: string): boolean

  delete(socketAlias: string, id: socketID): boolean
}

export class AliasPool implements IAliasPool {
  private _aliases: Map<string, Array<string>> = new Map()
  set(socketAlias: string, id: string): void {
    let idArray = this._aliases.get(socketAlias)

    if (!idArray) this._aliases.set(socketAlias, [id])
    else idArray.push(id)
  }

  swap(oldSocketAlias: string, newSocketAlias: string): boolean {
    let tmp = this.get(oldSocketAlias)
    if (!tmp) return false

    this.remove(oldSocketAlias)
    this._aliases.set(newSocketAlias, tmp)
    return true
  }

  isSet(socketAlias: string): boolean {
    if (!this._aliases.get(socketAlias)) return false
    return true
  }

  get(socketAlias: string): Array<string> | undefined {
    return this._aliases.get(socketAlias)
  }

  getId(socketAlias: string, id: string): boolean {
    let tmpArray = this._aliases.get(socketAlias)
    if (!tmpArray) return false

    return tmpArray.includes(id)
  }

  remove(socketAlias: string): boolean {
    return this._aliases.delete(socketAlias)
  }

  delete(socketAlias: string, id: string): boolean {
    const buffer = this._aliases.get(socketAlias)
    if (!buffer) return false

    let index = buffer.indexOf(id)
    if (!~index) return false

    buffer.splice(index, 1)
    return true
  }
}
