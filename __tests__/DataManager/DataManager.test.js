import { DataManager } from '../../lib/DataManager/DataManager.js'
import { Packet } from '../../lib/DataManager/Packet/Packet.js'

var stb = require('string-to-arraybuffer')

describe('Data manager', () => {
  var manager, socketData, socketStringData

  beforeEach(() => {
    manager = new DataManager()
    socketData = {
      meta: {
        login: 'testLogin',
      },
      data: {
        password: 'testPassword',
      },
    }
    socketStringData = JSON.stringify(socketData)
  })

  describe('Test with correct data', () => {
    describe('Test get/set functions', () => { 
    test('set socket data', () => {
      expect((manager.packet = stb(socketStringData)))
    })

    test('get packet from socket data', () => {
      manager.packet = stb(socketStringData)
      expect(manager.string).toBe(socketStringData)
    })

    test('get data object', () => {
      manager.packet = stb(socketStringData)
      expect(manager.object).toEqual(socketData)
    })

    test('get some packet data from socket', () => {
      manager.packet = stb(socketStringData)
      expect(manager.get('meta/login')).toBe('testLogin')
      expect(manager.get('data/password')).toBe('testPassword')
    })

    test('get stringify data from packet object', () => {
      let packet = DataManager.createPacket()
      packet.set('meta/login', 'testLogin')
      packet.set('data/password', 'testPassword')

      expect(DataManager.toString(packet)).toEqual(socketStringData)
    })
    })
    describe('Create new packet', () => {
      test('with no params', () => {
        expect(DataManager.createPacket()).toBeInstanceOf(Packet)
      })

      test('1 param only with data', () => {
        let packet = DataManager.createPacket({password: 'testPassword'})
        expect(packet.object.data)
        .toEqual(socketData.data) 
      })

      test('1 param with data and meta', () => {
        let packet = DataManager.createPacket(socketData)
        expect(packet.object)
        .toEqual(socketData)
      })

      test('2 params', () => {
        let packet = DataManager.createPacket({password:'testPassword'}, {login: 'testLogin'})
        expect(packet.object).toEqual(socketData)
      })
    })
  })
})
