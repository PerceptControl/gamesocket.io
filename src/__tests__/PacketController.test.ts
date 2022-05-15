import { DataDecoder } from '../DataManager/PacketController/DataDecoder'
import { PacketController } from '../DataManager/PacketController/PacketController'
import {
  PacketStructure,
  PacketStructureConfig,
} from '../DataManager/StructureConfig'
var stb = require('string-to-arraybuffer')

describe('Packet controller', () => {
  var controller: PacketController,
    socketData: string,
    newConfig: PacketStructure

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

  describe('Test with custom packet configuration', () => {
    beforeEach(() => {
      controller = new PacketController()

      newConfig = {
        meta: {},
        user: {},
      }

      controller.config = newConfig

      socketData = JSON.stringify({
        meta: {
          login: 'testLogin',
        },
        data: {
          password: 'testPassword',
        },
      })
    })

    test('Set all socket data as ArrayBuffe', () => {
      expect(() => controller.setData(stb(socketData))).toThrow(Error)
    })
  })
})

describe('Packet decoder', () => {
  var decoder: DataDecoder, socketData: any, configObject: PacketStructure

  describe('Test with corrupted data', () => {
    beforeEach(() => {
      decoder = new DataDecoder(PacketStructureConfig)
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
