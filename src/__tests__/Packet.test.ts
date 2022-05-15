import { Packet } from '../DataManager/Packet/Packet'
import { PacketStructure } from '../DataManager/StructureConfig'

describe('Packet class', () => {
  var packet: Packet, packetObject: PacketStructure

  beforeEach(() => {
    packetObject = {
      meta: {
        roomName: 'name',
      },
      data: {
        login: 'test',
      },
    }

    packet = new Packet(packetObject)
  })

  describe('With correct data', () => {
    test('Set packet data object', () => {
      expect(packet.data).toBe(packetObject)
    })

    test('Get packet data parameter', () => {
      expect(packet.get('meta/roomName')).toBe('name')
      expect(packet.get('data/login')).toBe('test')
    })

    test('Get empty packet data parameter', () => {
      expect(packet.get('data/password')).toBe(undefined)
    })

    test('Remove packet data parameter', () => {
      packet.remove('data/login')
      expect(packet.get('data/login')).toBe(undefined)
    })

    test('Set packet data parameter', () => {
      packet.set('data/password', 'secure')
      expect(packet.get('data/password')).toBe('secure')
    })
  })

  describe('With wrong data', () => {
    var errorMessage: any, randomString: string

    beforeEach(() => {
      randomString = (Math.random() + 1).toString(36).substring(5)
    })
    test('Get random name parameter with broken path', () => {
      errorMessage = `Path parameter shall be segment/name. Get ${randomString}`
      let path3 = `${randomString}/${randomString}/${randomString}`
      expect(() => packet.get(randomString)).toThrow(Error(errorMessage))
    })

    test('Get random name parameter with correct path', () => {
      errorMessage = `Cannot read properties of undefined (reading '${randomString}')`
      expect(() => packet.get(`${randomString}/${randomString}`)).toThrow(
        Error(errorMessage),
      )
    })

    test('Set random name parameter with broken path', () => {
      errorMessage = `Path parameter shall be segment/name. Get ${randomString}`
      let path3 = `${randomString}/${randomString}/${randomString}`
      expect(() => packet.set(randomString, null)).toThrow(Error(errorMessage))
    })

    test('Set random name parameter with correct path', () => {
      errorMessage = `Cannot set properties of undefined (setting '${randomString}')`
      let path = `${randomString}/${randomString}`
      expect(() => packet.set(path, 'some corrupted data')).toThrow(
        Error(errorMessage),
      )
    })

    test('Remove random name parameter with broken path', () => {
      errorMessage = `Path parameter shall be segment/name. Get ${randomString}`
      let path = `${randomString}`
      expect(() => packet.remove(path)).toThrow(Error(errorMessage))
    })

    test('Remove random name parameter with correct path', () => {
      let path = `${randomString}/${randomString}`
      errorMessage = `Cannot set properties of undefined (setting '${randomString}')`
      expect(() => packet.remove(path)).toThrow(Error(errorMessage))
    })
  })
})
