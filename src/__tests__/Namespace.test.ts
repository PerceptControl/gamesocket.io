import { v4 as uuid } from "uuid";
import { ServerProxy } from "../ServerProxy/ServerProxy";
import { DataManager } from "../DataManager/DataManager";
import { EventManager } from "../EventManager/EventManager";
import { Namespace } from "../Namespace/Namespace";

jest.mock("../ServerProxy/ServerProxy")

describe('Namespace', () => {
  let manager = new EventManager('test')
  const space = new Namespace('test', manager)

  test('on', () => {
    let myMock = jest.fn()
    space.on('testEvent', myMock)
    manager.get('testEvent')!.execute(DataManager.spawn('test'))
    expect(myMock).toBeCalledTimes(1)
  })

  describe('control', () => {
    test('init', () => {
      const id = uuid()
      expect(space.control('test')).toEqual({"_rooms": ['test/test']})
      expect(space.control(id)).toEqual({"_name": 'test', "_sockets": [id]})

      expect(space.control(['test', 'test2'])).toEqual({"_rooms": ['test/test', 'test/test2']})
      expect(space.control(['test/test', 'test2'])).toEqual({"_rooms": ['test/test', 'test/test2']})
      expect(space.control([id, id])).toEqual({"_name": 'test', "_sockets": [id, id]})

      expect(() => space.control('broadcast')).toThrow(Error)
      expect(() => space.control(['broadcast', 'test'])).toThrow(Error)
      expect(() => space.control(['test', 'broadcast'])).toThrow(Error)

      
    })

    describe('emit', () => {
      test('to rooms', () => {
        let myMock = jest.fn()
        ServerProxy.emit = myMock
        
        space.emit('test', 'test')
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()
  
        space.control('test').emit('test', 'test')
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()
  
        space.control(['test', 'test2']).emit('test', 'test')
        expect(myMock).toBeCalledTimes(2)
      })
  
      test('to sockets', () => {
        let id = uuid()
        let myMock = jest.fn()
        ServerProxy.send = myMock
  
        space.control(id).emit('test', 'test')
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()
  
        space.control([id, id]).emit('test', 'test')
        expect(myMock).toBeCalledTimes(2)
      })
    })

    describe('join', () => {
      test('with room control', () => {
        let myMock = jest.fn()
        ServerProxy.subscribe = myMock
        
        space.control('test').join(uuid())
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()

        space.control('test').join([uuid(), uuid()])
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control(['test', 'test2']).join(uuid())
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control(['test', 'test2']).join([uuid(), uuid()])
        expect(myMock).toBeCalledTimes(4)
        myMock.mockClear()
      })

      test('with socket control', () => {
        let myMock = jest.fn()
        ServerProxy.subscribe = myMock
        
        space.control(uuid()).join('test')
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()

        space.control(uuid()).join(['test', 'test2'])
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control([uuid(), uuid()]).join('test')
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control([uuid(), uuid()]).join(['test', 'test2'])
        expect(myMock).toBeCalledTimes(4)
        myMock.mockClear()
      })
    })

    describe('leave', () => {
      test('with room control', () => {
        let myMock = jest.fn()
        ServerProxy.unsubscribe = myMock
        
        space.control('test').leave(uuid())
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()

        space.control('test').leave([uuid(), uuid()])
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control(['test', 'test2']).leave(uuid())
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control(['test', 'test2']).leave([uuid(), uuid()])
        expect(myMock).toBeCalledTimes(4)
        myMock.mockClear()
      })

      test('with socket control', () => {
        let myMock = jest.fn()
        ServerProxy.unsubscribe = myMock
        
        space.control(uuid()).leave('test')
        expect(myMock).toBeCalledTimes(1)
        myMock.mockClear()

        space.control(uuid()).leave(['test', 'test2'])
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control([uuid(), uuid()]).leave('test')
        expect(myMock).toBeCalledTimes(2)
        myMock.mockClear()

        space.control([uuid(), uuid()]).leave(['test', 'test2'])
        expect(myMock).toBeCalledTimes(4)
        myMock.mockClear()
      })
    })
  })
})