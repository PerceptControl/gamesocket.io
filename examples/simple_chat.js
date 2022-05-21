import { Server, SocketPool } from 'gamesocket.io'
import { v4 as uuid } from 'uuid'

var main = Server.namespace('main')
main.onopen((socket) => {
  Server.attachIdToSocket(uuid(), socket)
  main.attach(socket)

  console.log(`Main open: ${socket.id} connected!`)
})

main.on('login', (socketId, manager) => {
  var userName = manager.get('data/name')
  if (SocketPool.Aliases.isSet(userName))
    main.to(socketId).emit('User already exist', { name: userName })
  else {
    SocketPool.Sockets.get(socketId).alias = userName
    SocketPool.Aliases.set(socketId, userName)
    main.to(socketId).emit('login', {
      message: `now your name changed to ${userName}`,
    })
    main.emit('new user', { name: userName })
  }
})

main.on('private message', (socketId, manager) => {
  var fromSocket = SocketPool.Sockets.get(socketId)
  var toAlias = SocketPool.Aliases.getId(manager.get('data/to'))
  var message = manager.get('data/message')

  //If packet corrupted or user isn't login
  if (fromSocket.alias && toAlias && message) {
    main
      .to(toAlias)
      .emit('private', { mesasge: message, from: fromSocket.alias })
  }
})

main.on('group message', (socketId, manager) => {
  var fromSocket = SocketPool.Sockets.get(socketId)

  var groupName = manager.get('data/group')
  var message = manager.get('data/message')

  if (fromSocket.alias && groupName && message) {
    main
      .to(groupName)
      .emit('group', { message: message, from: fromSocket.alias })
  }
})

main.on('join', (socketId, manager) => {
  var groupName = manager.get('data/group')

  if (groupName) {
    main.to(groupName).join(socketId)
    main.to(socketId).emit('join', { group: groupName })
  }
})

main.on('leave', (socketId, manager) => {
  var groupName = manager.get('data/group')

  if (groupName) {
    main.to(groupName).leave(socketId)
    main.to(socketId).emit('leave', { group: groupName })
  }
})

main.onclose((socket) => {
  console.log(`Main close: ${socket.id} disconnected!`)
  Server.eraseSocket(socket)
})

main.on('undefined event', (socketId, manager) => {
  console.log('Socket %s tried to call %', socketId, manager.get('meta/event'))
})

Server.listen(3000, (listenSocket) => {
  if (listenSocket) console.log('Listening on port 3000')
})
