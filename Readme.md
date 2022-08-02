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

app = io()

var socketAlias = ...
var socketId = ...

app.aliases.set(socketId, socketAlias)
ap.aliases.swap(socketAlias, 'someNewAlias')
app.aliases.getId('someNewAlias')
```

#### Namespace support

You can use many namespaces depending on your needs.

```js
//js

import { Server } from 'gamesocket.io'

//emit to custom room in test namespace
Server.of('test').control('room').emit('someEvent')

//emit to custom socket in admin namespace
Server.of('admin').control(socketId).emit('someEvent')
```

#### Adaptive destination controller

You can use rooms and sockets in much ways.

```js
//js

//create test namespace
var test = app.namespace('test')

//Sockets with ids 1, 2 join rooms 1, 2
test.control(['room1', 'room2']).join([id1, id2])

//Emits event to rooms 1, 2
test.control(['room1', 'room2']).emit('someEvent')

//Emits event to room
test.control('room').emit('someEvent')

//Emits event to sockets with ids 1, 2
test.control([id1, id2]).emit('someEvent')

//Sockets with ids 1, 2 join room
test.control([id1, id2]).join('room')

//Sockets with id1 leaves room
test.control(id1).leave('room')
```

#### Convenient data manager

All packets shall have same structure:

```typescript
//typescript
export declare interface IDataEscort extends IEscort<finalData> {
  get(property: string): finalData | undefined
  get isPrimitive(): boolean
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
  *   event: login
  *   data: {
  *     login: 'anAwesomeName',
  *     password: 'hardPassword'
  *   }
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
import io from 'gamesocket.io'

var app = io()
var main = io.of('main')
main.on('someEvent', (escort) => {
  /**
   * {
   *   event: 'someEvent',
   *   alias: 'test'
   * }
  */
  console.log(escort.event == 'someEvent')
  var alias = manager.get('alias')

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

1. ~~**Custom packet structure configuration**~~
2. ~~**uWebSocket websocket configuration support**~~
3. **Node.js worker support**

And more...

If you want to help, please write on sa1rac.work@gmail.com
