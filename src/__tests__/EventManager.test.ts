import { DataEscort } from "../DataManager/DataEscort/DataEscort.js";
import { EventEscort, EventManager } from "../EventManager/EventManager.js";


describe('Event Escort', () => {
  test('Initialization', () => {
    let myMock = jest.fn()
    let test = new EventEscort('testID', 'testName', myMock)
  
    expect(test.id).toBe('testID')
    expect(test.event).toBe('testName')
    test.used.call({name: test.event, id: test.id}, new DataEscort('testID', 'testName'))
    
    test.execute(new DataEscort('testID', 'testName'))
    expect(myMock).toBeCalledTimes(2)

    myMock.mockClear()
    test.used = myMock
    test.execute(new DataEscort('testID', 'testName'))
    expect(myMock).toBeCalledTimes(1)
  })

  test('Undefined event', () => {
    const test = new EventEscort('testID', 'testName')
    expect(() => {test.execute(new DataEscort('testID', 'testName'))}).toThrowError("Unsetted function on event 'testName'")
  })
})

describe('Event Manager', () => {
  let manager = new EventManager('test')
  let myMock = jest.fn()

  test('create instance', () => {
    expect(manager.spawn('testEvent')).toBeInstanceOf(EventEscort)
    expect(manager.spawn('testEvent', myMock)).toBeInstanceOf(EventEscort)

    manager = new EventManager('test')
    manager.spawn('test')
    expect(manager.pool).toBeInstanceOf(Map) 
  })

  test('find escort', () => {
    let escort = manager.spawn('testEvent')

    expect(manager.get(escort)).toEqual(escort)
  })

  test('delete escort', () => {
    let escort = manager.spawn('testEvent')

    expect(manager.drop(escort)).toBeTruthy()
    expect(manager.drop('randomID')).toBeFalsy()
  })
})