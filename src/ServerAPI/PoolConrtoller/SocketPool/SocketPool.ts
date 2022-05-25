import { WebSocket } from 'uWebSockets.js'
import { ISocketPool } from './ISocketPool'

export class SocketPool implements ISocketPool {
  private static sockets: Map<string, WebSocket> = new Map()

  public get(id: string): WebSocket | undefined {
    return SocketPool.sockets.get(id)
  }

  public set(id: string, socket: WebSocket) {
    SocketPool.sockets.set(id, socket)
  }

  public remove(id: string) {
    return SocketPool.sockets.delete(id)
  }
}
