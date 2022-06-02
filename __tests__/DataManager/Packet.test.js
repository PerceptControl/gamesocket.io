import { Packet } from '../../lib/DataManager/Packet/Packet.js'

describe('Packet class', () => {
  var packet, packetObject

  beforeEach(() => {
    packetObject = {
      meta: {
        roomName: 'name',
      },
      data: {
        login: 'test',
      },
    }

    packet = new Packet()
    packet.object = packetObject
  })

  describe('With correct data', () => {
    test('Set packet data object', () => {
      expect(packet.object).toBe(packetObject)
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
    var errorMessage, randomString

    beforeEach(() => {
      randomString = (Math.random() + 1).toString(36).substring(5)
    })
    test('Get random name parameter with broken path', () => {
      let path3 = `${randomString}/${randomString}/${randomString}`
      errorMessage = `Path parameter shall be segment(meta/data)/name. Get ${path3}`
      expect(() => packet.get(path3)).toThrow(Error(errorMessage))
    })

    test('Get random name parameter with correct by number path', () => {
      let path = `${randomString}/${randomString}`
      errorMessage = `Path parameter shall be segment(meta/data)/name. Get ${path}`
      expect(() => packet.get(path)).toThrow(Error(errorMessage))
    })

    test('Get random name parameter with correct by name path', () => {
      let path = `meta/${randomString}`
      expect(packet.get(path)).toBe(undefined)
    })

    test('Set random name parameter with broken path', () => {
      let path3 = `${randomString}/${randomString}/${randomString}`
      errorMessage = `Path parameter shall be segment(meta/data)/name. Get ${path3}`
      expect(() => packet.set(path3, null)).toThrow(Error(errorMessage))
    })

    test('Set random name parameter with correct by number path', () => {
      let path = `${randomString}/${randomString}`
      errorMessage = `Path parameter shall be segment(meta/data)/name. Get ${path}`
      expect(() => packet.set(path, 'some corrupted data')).toThrow(
        Error(errorMessage),
      )
    })

    test('Remove random name parameter with broken path', () => {
      let path = `${randomString}`
      errorMessage = `Path parameter shall be segment(meta/data)/name. Get ${path}`
      expect(() => packet.remove(path)).toThrow(Error(errorMessage))
    })

    test('Remove random name parameter with correct path', () => {
      let path = `${randomString}/${randomString}`
      errorMessage = `Path parameter shall be segment(meta/data)/name. Get ${path}`
      expect(() => packet.remove(path)).toThrow(Error(errorMessage))
    })
  })
})
