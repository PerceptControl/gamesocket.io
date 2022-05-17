import { DataDecoder } from '../DataManager/PacketController/DataDecoder'
import { PacketController } from '../DataManager/PacketController/PacketController'
import { PacketStructure } from '../index'
var stb = require('string-to-arraybuffer')

describe('Packet controller', () => {
  var controller: PacketController, socketData: string

  describe('Test with correct data', () => {
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
})

describe('Packet decoder', () => {
  var decoder: DataDecoder, socketData: any, configObject: PacketStructure
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
})
