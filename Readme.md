# gamesocket.io

## What is it?

Simple event-driven WebSocket server API based on uWebSocket.js

## Features

#### Built-in aliases

Package provides a simple alias map, which is very useful when you need to find
a socket ID by given name

```js
//js

/* initialization code... */

import { SocketPool } from 'gamesocket.io'

var socketAlias = ...
var socketId = ...

SocketPool.Aliases.set(socketId, socketAlias)
SocketPool.Aliases.swap(socketAlias, 'someNewAlias')
SocketPool.Aliases.getId('someNewAlias')
```

#### Namespace & room support

You can use many namespaces and rooms depending on your needs.

```js
//js

import { Server } from 'gamesocket.io'

var test = Server.namespace('test')

//emit to custom room
test.to('room').emit('someEvent')

//emit to custom socket
test.to(someSocketId).emit('someEvent')

//emit to custom rooms in namepsace
test.to(['room1', 'room2']).emit('someEvent')

//broadcast to all rooms in namespace
test.to('all').emit('someEvent')

//broadcast to all sockets which connected to namespace
test.emit('someEvent')
```

#### Convenient data manager

All packets shall have same structure:

```typescript
//typescript
interface PacketStructure {
  meta: {
    [key: string | number]: any
  }
  data: {
    [key: string | number]: any
  }
}
```

It means that all handlers could use same methods to auto-decode and parse
socket binary data.

For example:

```js
//js

/*
  * Suppose packet was
  * {
  *   meta: { event: login }
  *   data: { login: 'anAwesomeName', password: 'hardPassword' }
  * }
*/

/* initialization code... */

test.on('login', (socketId, manager) => {
  var login = manager.get('data/login')
  var password = manager.get('data/password')

  if(login == 'anAwesomeName' && password == "hardPassword")
  // ...
})
```

---

## Installation

// With NPM

```
npm install gamesocket.io
```

## How to use

The following example creates gamesocket.io websocket server which listening on
port 3000.

```js
import { Server, SocketPool } from 'gamesocket.io'

var main = Server.namespace('main')
main.on('someEvent', (socketId, manager) => {
  console.log(manager.get('meta/event') == 'someEvent')
  var alias = manager.get('data/alias')

  SocketPool.Aliases.set(socketId, alias)
})

Server.listen(3000, (listenSocket) => {
  if (listenSocket) console.log('Listening on 3000')
})
```

---

## What's next?

In the near future the package will be overgrown with tests and optimized

And soon I probbably add next features:

1. **Custom http server support**
2. **@types for package**
3. **Custom packet structure configuration**
4. **uWebSocket websocket configuration support**
5. **Node.js worker support**

And more...

If you want to help, please write on sa1rac.work@gmail.com
