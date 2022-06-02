import { ServerProxy } from "../../lib/ServerAPI/ServerProxy";
import { v4 as uuid } from "uuid";
import { Namespace } from '../../lib/EventSystem/Namespace/Namespace.js'
import { DestinationController } from "../../lib/EventSystem/DestinationController/DestinationController";

const stb = require('string-to-arraybuffer')

jest.mock("../../lib/ServerAPI/ServerProxy")

describe('Test Namespace class', () => {
  var space
  beforeEach(() => {
    ServerProxy.mockClear()
    space = new Namespace('space') 
  })

  test('Control', () => {
    var controller = space.control('testRoom')
    expect(controller).toBeInstanceOf(DestinationController)

    controller = space.control('all')
    expect(controller.destination.destination).toEqual(['space/#'])
  })

  test('Close/Open', () => {
    var mock = jest.fn()
    space.onopen(mock)
    space.onclose(mock)

    space.behavior.open()
    space.behavior.close()

    expect(mock).toHaveBeenCalledTimes(2)
  })

  test('Set event', () => {
    var mock = jest.fn()
    space.on('testEvent', mock)

    space.spaceBehavior.behavior.structure.message('socket', stb(JSON.stringify({meta:{event:'testEvent'}, data:{}})))

    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('Emit', () => {
    var mock = jest.fn()
    ServerProxy.emit = mock
    space.emit('testEvent')

    expect(mock).toHaveBeenCalledWith(['space/broadcast'], 'testEvent')
    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('Attach', () => {
    var socket = {id: uuid()}
    var mock = jest.fn(id => true)

    ServerProxy.getSocket = jest.fn(socket => {return {subscribe: mock}})

    space.attach(socket)

    expect(space.sockets[socket.id]).toBe(true)
    expect(socket.namespace).toBe('space')

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('space/broadcast')
  })

  test('has', () => {
    var socket = {id: uuid()}
    space.attach(socket)

    expect(space.has(socket.id)).toBe(true)
    expect(space.has(uuid())).toBeFalsy()
  })
})