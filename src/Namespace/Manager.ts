import { EventManager, Namespace } from '../io'
import { List } from '../SocketList/List'
import logger from '../Logger/Logger'

class NamespaceList extends List<Namespace> {
  set(nmsp: Namespace) {
    if (this.has(nmsp.name)) return
    super.addOne(nmsp)
  }

  get(nmsp: string) {
    for (let i = 0; i < super._elements.length; i++) {
      if (super._elements[i]?.name == nmsp) return super._elements[i]
    }

    return undefined
  }

  has(nmsp: string) {
    for (let i = 0; i < super._elements.length; i++) {
      if (super._elements[i]?.name == nmsp) return true
    }

    return false
  }
}

export class NmspManager {
  private static _spaces = new NamespaceList()
  private static _managers: Map<string, EventManager> = new Map()

  public static get(name: string) {
    let space: Namespace
    if (name.startsWith('/')) name = name.split('/')[1]
    if (!this.has(name)) {
      if (logger.flags.debug) logger.debug(`Created namespace "${name}"`)
      let manager = new EventManager(name)
      space = new Namespace(name, manager)

      this.setManager(name, manager)
      this.setNamespace(space)

      return space
    }
    return this._spaces.get(name)!
  }

  public static get managers() {
    return this._managers
  }

  private static has(name: string) {
    return this._spaces.has(name)
  }

  private static setManager(name: string, manager: EventManager) {
    return this._managers.set(name, manager)
  }

  private static setNamespace(nmsp: Namespace) {
    return this._spaces.set(nmsp)
  }
}
