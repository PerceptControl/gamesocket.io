import { DataDecoder } from '../DataManager/PacketController/DataDecoder'
import { PacketController } from '../DataManager/PacketController/PacketController'
import { PacketStructure } from '../index'
import { DefaultPacketStructure } from '../DataManager/PacketStructure.config'
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

  describe('Test with corrupted data', () => {
    beforeEach(() => {
      decoder = new DataDecoder(DefaultPacketStructure)
      configObject = {
        meta: {},
        data: {},
      }

      socketData = JSON.stringify({
        meta: {
          login: 'testLogin',
        },
        data: {
          password: 'testPassword',
        },
      })

      decoder.config = configObject
    })

    test('set string as ArrayBuffer', () => {
      expect(() => decoder.getObject(socketData)).toThrow(Error)
    })
  })
})
