import { ServerEmitter } from "../../lib/ServerAPI/ServerEmitter.js";
import { Server } from "../../lib/Server.js";
import SocketPool from "../../lib/ServerAPI/PoolConrtoller/PoolController.js";
import { v4 as uuid } from 'uuid'

describe('Server Emitter',() => {
  var id = []
  var mockServer, mockSocket
  beforeEach(() => {
    mockServer = jest.fn()
    mockSocket = jest.fn()

    Server.publish = mockServer 

    id.push(uuid())
    id.push(uuid())
    id.push(uuid())
    id.push(uuid())

    id.forEach((id) => {
      SocketPool.Sockets.set(id, {send: mockSocket})
    })
  })

  test('emit to socket', () => {
    ServerEmitter.toSocket(uuid(), 'event', [{value: 'test'}])
    var object = {
      meta: {event: 'event'},
      data: {value: 'test'}
    }
    id.forEach((i) => {
      ServerEmitter.toSocket(i, 'event', [{value: 'test'}])
      expect(mockSocket).toHaveBeenCalledWith(JSON
        .stringify(object), true, true)
    })

  })

  test('emit to roomArray', () => {
    var object = {
      meta: {event: 'event'},
      data: {value: 'test'}
    }
    ServerEmitter.toRoomArray(['room1', 'room2'], 'event', [{value: 'test'}])
    expect(mockServer).toHaveBeenCalledTimes(2)
  })

  test('create packet', () => {
    var packet = ServerEmitter.createPacket('event', [{value: 'test'}])
    expect(packet.object).toEqual({meta: {event: 'event'}, data: {value:'test'}})
    
    packet = ServerEmitter.createPacket('event', [{value: 'test'}, {value: 'meta/test'}])
    expect(packet.object).toEqual({meta: {event: 'event', value: 'meta/test'}, data: {value:'test'}})

    packet = ServerEmitter.createPacket('event', [{meta: {}, data:{ value: 'test'}}])
    expect(packet.object).toEqual({meta: {event: 'event'}, data: {value:'test'}})
  })
})