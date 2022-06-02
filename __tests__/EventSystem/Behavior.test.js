import { WsBehavior } from '../../lib/EventSystem/Behavior/Behavior.js'
var stb = require('string-to-arraybuffer')

describe('Test behavior mechanism', () => {
  var behavior, socketData
  beforeEach(() => {
    behavior = new WsBehavior
    socketData = {
      meta: {
        event: 'customEvent',
        login: 'testLogin',
      },
      data: {
        password: 'testPassword',
      },
    }
  })
  test('set open callback', () => { 
    var mockFunc = jest.fn()
    behavior.open = mockFunc

    expect(behavior.Handler.open).toBe(mockFunc)
  })

  test('set close callback', () => { 
    var mockFunc = jest.fn()
    behavior.close = mockFunc

    expect(behavior.Handler.close).toBe(mockFunc)
  })

  test('set custom callback', async () => { 
    var mockFunc = jest.fn()
    behavior.set('customEvent', mockFunc)

    await behavior.Handler.message('someSocket', stb(JSON.stringify(socketData)))
    expect(mockFunc.mock.calls.length).toBe(1)
  })

  test('set custom undefined event callback', async () => { 
    var mockFunc = jest.fn()
    behavior.set('undefined event', mockFunc)

    await behavior.Handler.message('someSocket', stb(JSON.stringify(socketData)))
    expect(mockFunc.mock.calls.length).toBe(1)
  })
})