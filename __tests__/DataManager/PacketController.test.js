import { DataDecoder } from '../../lib/DataManager/PacketController/DataDecoder.js'
import { PacketController } from '../../lib/DataManager/PacketController/PacketController.js'
var stb = require('string-to-arraybuffer')

describe('Packet controller', () => {
  var controller, socketData

  beforeEach(() => {
    controller = new PacketController()

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
    test('Get some socket data from ArrayBuffer', () => {
      controller.setData(stb(socketData))
      expect(controller.get('meta/login')).toBe('testLogin')
      expect(controller.get('data/password')).toBe('testPassword')
    })

    test('Get socket data as string', () => {
      controller.setData(stb(socketData))
      expect(controller.toString()).toBe(socketData)
    })
  })

  describe('Test with broken data', () => {
    test('socketData isn\'t packet structure', () => {
      socketData = 'someCorruptedData'
      expect(controller.setData(stb(JSON.stringify({brokenData: 'test'})))).toBe(false)
    })
  })
})

describe('Packet decoder', () => {
  var decoder, socketData
  beforeEach(() => {
    decoder = new DataDecoder()

    socketData = JSON.stringify({
      meta: {
        login: 'testLogin',
      },
      data: {
        password: 'testPassword',
      },
    })
  })

  test('set string as ArrayBuffer', () => {
    expect(() => decoder.getObject(socketData)).toThrow(Error)
  })

  test('get object from ArrayBuffer', () => {
    expect(decoder.getObject(stb(socketData))).toEqual(JSON.parse(socketData))
  })

  test('get object from ArrayBuffer', () => {
    expect(() => decoder.getObject('someCorruptedData')).toThrow(Error)
  })
})
