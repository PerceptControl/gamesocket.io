import { socketId } from '../../..'

export interface IAliasPool {
  set(socketAlias: string, id: socketId): void

  swap(oldSocketAlias: string, newSocketAlias: string): boolean

  isSet(socketAlias: string): boolean

  get(socketAlias: string): Array<string> | undefined

  getId(socketAlias: string, id: socketId): void

  remove(socketAlias: string): boolean

  delete(socketAlias: string, id: socketId): boolean
}
