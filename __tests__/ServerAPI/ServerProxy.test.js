import { SocketPool } from "../../lib/ServerAPI/PoolConrtoller/SocketPool/SocketPool.js";
import { ServerProxy } from "../../lib/ServerAPI/ServerProxy.js";
import { ServerEmitter } from '../../lib/ServerAPI/ServerEmitter.js'
import { v4 as uuid } from 'uuid' 

describe('Test server proxy', () => {
    var mockRoom, mockSocket
    beforeEach(() => {
      mockRoom = jest.fn()
      mockSocket = jest.fn()

      ServerEmitter.toSocket = mockSocket
      ServerEmitter.toRoomArray = mockRoom
    })

    test('emit', () => {
      ServerProxy.emit(uuid(), 'test')
      ServerProxy.emit(['room', 'room'], 'test')

      expect(mockSocket).toHaveBeenCalledTimes(1)
      expect(mockRoom).toHaveBeenCalledTimes(1)
    })

    describe('manipulate', () => {
      test('add', () => {
        ServerProxy.addId('1234', true)
        expect(SocketPool.sockets.get('1234')).toBe(true)
      })

      test('get', () => {
        ServerProxy.addId('1234', true)
        expect(ServerProxy.getSocket('1234')).toBe(true)
      })

      test('remove', () => {
        ServerProxy.addId('1234', true)
        ServerProxy.removeId('1234')
        expect(ServerProxy.getSocket('1234')).toBeUndefined()
      })
    })
})

describe('Test socket pool', () => {
  test('add socket', () => {
    var pool = new SocketPool()
    pool.set('1234', true)
    expect(SocketPool.sockets.get('1234')).toBe(true)
  })

  test('get socket', () => {
    var pool = new SocketPool()
    pool.set('1234', true)
    expect(pool.get('1234')).toBe(true)
  })

  test('remove socket', () => {
    var pool = new SocketPool()
    pool.set('1234', true)
    pool.remove('1234')
    expect(pool.get('1234')).toBe(undefined)
  })
})