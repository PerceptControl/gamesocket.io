import { ServerProxy } from "../ServerProxy/ServerProxy";
import { WebSocket } from "uWebSockets.js";
import { Behavior } from "../Behavior/Behavior";
import { EventManager } from "../EventManager/EventManager";
import { Namespace } from "../Namespace/Namespace";
const stb = require('string-to-arraybuffer')

jest.mock("../ServerProxy/ServerProxy")
ServerProxy.pool = new Map()

describe('Behavior', () => {
  let manager: EventManager, nmsp: Namespace
  beforeEach(() => {
    manager = new EventManager('test')
    nmsp = new Namespace('test', manager)
  })

  test('open', () => {
    let bhv = new Behavior(manager)
    let myMock = jest.fn()
    
    bhv.open({subscribe: jest.fn()} as unknown as WebSocket)
    nmsp.on('open', myMock)
    bhv.open({subscribe: jest.fn()} as unknown as WebSocket)

    expect(myMock).toBeCalledTimes(1)
  })

  test('close', async () => {
    let bhv = new Behavior(manager)
    let myMock = jest.fn()
 
    bhv.close({id: 'test'} as unknown as WebSocket, 100, stb('testMessage'))
    nmsp.on('close', myMock)
    await bhv.close({id: 'test'} as unknown as WebSocket, 100, stb('testMessage'))
    
    expect(myMock).toBeCalledTimes(1)
  })

  test('message', async () => {
    let bhv = new Behavior(manager)
    let myMock = jest.fn()
 
    await bhv.message({id: 'test'} as unknown as WebSocket, stb(JSON.stringify({
      event:'testEvent',
      data: 'test'
    })), true)
    nmsp.on('testEvent', myMock)
    await bhv.message({id: 'test'} as unknown as WebSocket, stb(JSON.stringify({
      event:'testEvent',
      data: 'test'
    })), true)
    
    expect(myMock).toBeCalledTimes(1)
    myMock.mockClear()

    nmsp.on('undefined data', myMock)
    await bhv.message({id: 'test'} as unknown as WebSocket, stb('test'), true)
    expect(myMock).toBeCalledTimes(1)
    myMock.mockClear()

    nmsp.on('undefined event', myMock)
    await bhv.message({id: 'test'} as unknown as WebSocket, stb(JSON.stringify({
      data: 'test'
    })), true)
    expect(myMock).toBeCalledTimes(1)
  })

  test('drain', async () => {
    let bhv = new Behavior(manager)
    let myMock = jest.fn()

    await bhv.drain({id: 'test'} as unknown as WebSocket)
    nmsp.on('drain', myMock)
    await bhv.drain({id: 'test'} as unknown as WebSocket)

    expect(myMock).toBeCalledTimes(1)
  })
})