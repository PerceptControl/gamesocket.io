import { SocketPool } from './SocketPool/SocketPool.js'
import { AliasPool } from './AliasPool/AliasPool.js'

export default { Sockets: new SocketPool(), Aliases: new AliasPool() }
