import { DataManager } from '../lib/DataManager/DataManager.js'
import { Packet } from '../lib/DataManager/Packet/Packet.js'

var stb = require('string-to-arraybuffer')

describe('Data manager', () => {
  var manager, socketData

  beforeEach(() => {
    manager = new DataManager()
    socketData = JSON.stringify({
      meta: {
        login: 'testLogin',
      },
      data: {
        password: 'testPassword',
      },
    })
  })

  describe('Test with correct data', () => {
    test('create new packet', () => {
      expect(DataManager.createPacket()).toBeInstanceOf(Packet)
    })

    test('set socket data', () => {
      expect((manager.packet = stb(socketData)))
    })

    test('get packet from socket data', () => {
      manager.packet = stb(socketData)
      expect(manager.string).toBe(socketData)
    })

    test('get some packet data from socket', () => {
      manager.packet = stb(socketData)
      expect(manager.get('meta/login')).toBe('testLogin')
      expect(manager.get('data/password')).toBe('testPassword')
    })

    test('get stringify data from packet object', () => {
      let packet = DataManager.createPacket()
      packet.set('meta/login', 'testLogin')
      packet.set('data/password', 'testPassword')

      expect(DataManager.toString(packet)).toEqual(socketData)
    })
  })
})
