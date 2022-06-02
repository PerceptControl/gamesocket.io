import { DestinationController } from "../../lib/EventSystem/DestinationController/DestinationController.js";
import { ServerProxy } from '../../lib/ServerAPI/ServerProxy.js'
import { v4 as uuid } from 'uuid'
import { DestinationRooms } from "../../lib/EventSystem/DestinationController/DestinationRooms";
import { DestinationSocket } from "../../lib/EventSystem/DestinationController/DestinationSocket";

jest.mock('../../lib/ServerAPI/ServerProxy.js')

describe('Test Destination Controller', () => {
  var destinationRooms, destinationSocket, controller
  var mockEmit, mockGetSocket, mockSubscribe, mockUnsubscribe
  beforeEach(() => {
    ServerProxy.mockClear()
  })

  describe('test with rooms', () => {
    beforeEach(() => {
      destinationRooms = ['room1', 'room2']
      destinationSocket = [uuid(), uuid()]

      mockEmit = jest.fn()
      ServerProxy.emit = mockEmit
    })

    describe('with >2', () => {
      beforeEach(() => {
        destinationRooms = ['room1', 'room2']
        destinationSocket = [uuid(), uuid()]
  
        mockEmit = jest.fn()
        ServerProxy.emit = mockEmit
  
        controller = new DestinationController(destinationRooms, 'test')
      })
      test('create instance', () => {
        expect(controller.destination).toBeInstanceOf(DestinationRooms)
        expect(controller.destination.destination).toEqual(['test/room1', 'test/room2'])
  
      })
  
      test('create instance with test/roomx array', () => {
        expect(controller.destination.destination).toEqual(['test/room1', 'test/room2'])
  
      })
  
      test('emit event', () => {
        controller.emit('testEvent', {someData: 'test'})
  
        expect(mockEmit).toHaveBeenCalledWith(['test/room1', 'test/room2'],'testEvent',{someData: 'test'})
        expect(mockEmit).toHaveBeenCalledTimes(1)
      })
  
      describe('join', () => {
        beforeEach(() => {
          destinationRooms = ['room1', 'room2']
          destinationSocket = [uuid(), uuid()]
    
          mockSubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { subscribe: mockSubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })
        test('join with 2 destination socket', () => {
          controller.join(destinationSocket)
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationRooms.length * destinationSocket.length)
        })
    
        test('join with 1 destination socket', () => {
          controller.join(destinationSocket[0])
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationRooms.length)
        })
    
        test('join with no destination socket', () => {
          expect(() => controller.join('fakeUuid')).toThrow(Error)
        })
      })
  
      describe('leave', () => {
        beforeEach(() => {
          destinationRooms = ['room1', 'room2']
          destinationSocket = [uuid(), uuid()]
    
          mockUnsubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { unsubscribe: mockUnsubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })
        test('leave with 2 destination socket', () => {
          controller.leave(destinationSocket)
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationRooms.length * destinationSocket.length)
        })
    
        test('leave with 1 destination socket', () => {
          controller.leave(destinationSocket[0])
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationRooms.length)
        })
    
        test('leave with no destination socket', () => {
          expect(() => controller.leave('fakeUuid')).toThrow(Error)
        }) 
      })
    })

    describe('with 1', () => {
      beforeEach(() => {
        destinationRooms = 'test/room'
        destinationSocket = [uuid(), uuid()]
  
        mockEmit = jest.fn()
        ServerProxy.emit = mockEmit
  
        controller = new DestinationController(destinationRooms, 'test')
      })
      test('create instance', () => {
        expect(controller.destination).toBeInstanceOf(DestinationRooms)
        expect(controller.destination.destination).toEqual(['test/room'])
  
      })
  
      test('create instance with test/roomx array', () => {
        expect(controller.destination.destination).toEqual(['test/room'])
  
      })
  
      test('emit event', () => {
        controller.emit('testEvent', {someData: 'test'})
  
        expect(mockEmit).toHaveBeenCalledWith(['test/room'],'testEvent',{someData: 'test'})
        expect(mockEmit).toHaveBeenCalledTimes(1)
      })
  
      describe('join', () => {
        beforeEach(() => {
          destinationRooms = ['room']
          destinationSocket = [uuid(), uuid()]
    
          mockSubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { subscribe: mockSubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })
        test('join with 2 destination socket', () => {
          controller.join(destinationSocket)
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationRooms.length * destinationSocket.length)
        })
    
        test('join with 1 destination socket', () => {
          controller.join(destinationSocket[0])
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationRooms.length)
        })
    
        test('join with no destination socket', () => {
          expect(() => controller.join('fakeUuid')).toThrow(Error)
        })
      })
  
      describe('leave', () => {
        beforeEach(() => {
          destinationRooms = ['room']
          destinationSocket = [uuid(), uuid()]
    
          mockUnsubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { unsubscribe: mockUnsubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })
        test('leave with 2 destination socket', () => {
          controller.leave(destinationSocket)
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationRooms.length * destinationSocket.length)
        })
    
        test('leave with 1 destination socket', () => {
          controller.leave(destinationSocket[0])
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationRooms.length)
        })
    
        test('leave with no destination socket', () => {
          expect(() => controller.leave('fakeUuid')).toThrow(Error)
        }) 
      })
    })
  })

  describe('test with sockets', () => {
    beforeEach(() => {
      destinationRooms = ['room1', 'room2']
      destinationSocket = [uuid(), uuid()]

      mockEmit = jest.fn()
      ServerProxy.emit = mockEmit
    })

    describe('with >2', () => {
      beforeEach(() => {
        destinationRooms = ['room1', 'room2']
        destinationSocket = [uuid(), uuid()]
  
        mockEmit = jest.fn()
        ServerProxy.emit = mockEmit
  
        controller = new DestinationController(destinationSocket, 'test')
      })

      test('create instance', () => {
        expect(controller.destination).toBeInstanceOf(DestinationSocket)
        expect(controller.destination.destination).toEqual(destinationSocket)
  
      })
  
      test('emit event', () => {
        controller.emit('testEvent', {someData: 'test'})
  
        expect(mockEmit).toHaveBeenCalledTimes(destinationSocket.length)
      })
  
      describe('join', () => {
        beforeEach(() => {
          destinationRooms = ['room1', 'room2']
          destinationSocket = [uuid(), uuid()]
    
          mockSubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { subscribe: mockSubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })

        test('join with 2 destination socket', () => {
          controller.join(destinationRooms)
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationRooms.length * destinationSocket.length)
        })
    
        test('join with 1 destination socket', () => {
          controller.join(destinationRooms[0])
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationSocket.length)
        })
      })
  
      describe('leave', () => {
        beforeEach(() => {
          destinationRooms = ['room1', 'room2']
          destinationSocket = [uuid(), uuid()]
    
          mockUnsubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { unsubscribe: mockUnsubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })
        test('leave with 2 destination rooms', () => {
          controller.leave(destinationRooms)
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationSocket.length * destinationRooms.length)
        })
    
        test('leave with 1 destination rooms', () => {
          controller.leave(destinationRooms[0])
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationSocket.length)
        }) 
      })
    })

    describe('with >2', () => {
      beforeEach(() => {
        destinationRooms = ['room1', 'room2']
        destinationSocket = uuid()
  
        mockEmit = jest.fn()
        ServerProxy.emit = mockEmit
  
        controller = new DestinationController(destinationSocket, 'test')
      })

      test('create instance', () => {
        expect(controller.destination).toBeInstanceOf(DestinationSocket)
        expect(controller.destination.destination).toEqual([destinationSocket])
  
      })
  
      test('emit event', () => {
        controller.emit('testEvent', {someData: 'test'})
  
        expect(mockEmit).toHaveBeenCalledTimes(1)
      })
  
      describe('join', () => {
        beforeEach(() => {
          destinationRooms = ['room1', 'room2']
          destinationSocket = [uuid(), uuid()]
    
          mockSubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { subscribe: mockSubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })

        test('join with 2 destination socket', () => {
          controller.join(destinationRooms)
          expect(mockSubscribe).toHaveBeenCalledTimes(destinationRooms.length)
        })
    
        test('join with 1 destination socket', () => {
          controller.join(destinationRooms[0])
          expect(mockSubscribe).toHaveBeenCalledTimes(1)
        })
      })
  
      describe('leave', () => {
        beforeEach(() => {
          destinationRooms = ['room1', 'room2']
          destinationSocket = [uuid(), uuid()]
    
          mockUnsubscribe = jest.fn()
          mockGetSocket = jest.fn((socket) => {return { unsubscribe: mockUnsubscribe }})
  
          ServerProxy.getSocket = mockGetSocket
        })
        test('leave with 2 destination rooms', () => {
          controller.leave(destinationRooms)
          expect(mockUnsubscribe).toHaveBeenCalledTimes(destinationRooms.length)
        })
    
        test('leave with 1 destination rooms', () => {
          controller.leave(destinationRooms[0])
          expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
        }) 
      })
    })
  })
})