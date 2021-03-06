import { Server, PoolController } from '../lib/Server.js'
import { v4 as uuid } from 'uuid'

var main = Server.namespace('main')
Server.open = (socket) => {
  Server.attachIdToSocket(uuid(), socket)
  main.attach(socket)
  console.log(`Main open: ${socket.id} connected!`)
}

main.on('login', (socketId, manager) => {
  var userName = manager.get('data/name')
  if (PoolController.Aliases.isSet(userName)) main.control(socketId).emit('User already exist', { name: userName })
  else {
    PoolController.Sockets.get(socketId).alias = userName
    PoolController.Aliases.set(socketId, userName)
    main.control(socketId).emit('login', {
      message: `now your name changed to ${userName}`,
    })
    main.emit('new user', { name: userName })
  }
})

main.on('private message', (socketId, manager) => {
  var fromSocket = PoolController.Sockets.get(socketId)
  var toAlias = PoolController.Aliases.getId(manager.get('data/to'))
  var message = manager.get('data/message')

  //If packet corrupted or user isn't login
  if (fromSocket.alias && toAlias && message) {
    main.control(toAlias).emit('private', { mesasge: message, from: fromSocket.alias })
  }
})

main.on('group message', (socketId, manager) => {
  var fromSocket = PoolController.Sockets.get(socketId)

  var groupName = manager.get('data/group')
  var message = manager.get('data/message')

  if (fromSocket.alias && groupName && message) {
    main.control(groupName).emit('group', { message: message, from: fromSocket.alias })
  }
})

main.on('join', (socketId, manager) => {
  var roomName = manager.get('data/room')
  if (roomName) {
    main.control(roomName).join(socketId)
    main.control(socketId).emit('join', { room: roomName, member: PoolController.Sockets.get(socketId).alias })
  }
})

main.on('leave', (socketId, manager) => {
  var groupName = manager.get('data/group')

  if (groupName) {
    main.control(groupName).leave(socketId)
    main.control(socketId).emit('leave', { group: groupName })
  }
})

Server.close = (socket) => {
  PoolController.Aliases.remove(socket.alias)
  Server.eraseSocket(socket)
  console.log(`Main close: ${socket.id} disconnected!`)
}

main.on('undefined event', (socketId, manager) => {
  console.log('Socket %s tried to call %', socketId, manager.get('meta/event'))
})

Server.listen(3000, (listenSocket) => {
  if (listenSocket) console.log('Listening on port 3000')
})
