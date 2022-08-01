import { DataEscort } from "../DataManager/DataEscort/DataEscort";
import { DataManager } from "../DataManager/DataManager"
import { dataObject } from "../DataManager/DataManager";

const testObject = {
  object: {
    val1: true,
    val2: 'beta',
    val3: 1
  } as dataObject,

  object1: {
    val1: false,
    val2: 'omega',
    val3: -1,
    innerObject: {
      val1: false,
      val2: 'omega',
      val3: -1,
    } as dataObject
  }
}

describe('Data Manager', () => {
  test('create instance', () => {
    expect(DataManager.spawn('testEvent')).toBeInstanceOf(DataEscort)
    expect(DataManager.spawn('testEvent', testObject)).toBeInstanceOf(DataEscort)
    expect(DataManager.spawn('testEvent', 'test')).toBeInstanceOf(DataEscort)
  })

  test('find escort', () => {
    let escort = DataManager.spawn('testEvent')

    expect(DataManager.get(escort.id)).toEqual(escort)
  })

  test('delete escort', () => {
    let escort = DataManager.spawn('testEvent')

    expect(DataManager.drop(escort.id)).toBeTruthy()
    expect(DataManager.drop('randomID')).toBeFalsy()

    escort = DataManager.spawn('testEvent')

    expect(DataManager.drop(escort)).toBeTruthy()
    expect(DataManager.drop('randomID')).toBeFalsy()
  })
})

describe('Data Escort', () => {
  test('create instance', () => {
    let escort = new DataEscort('testId', 'testEvent')
    
    expect(escort.id).toBe('testId')
    expect(escort.event).toBe('testEvent')

    expect(escort.used).toBeUndefined()
    expect(escort.get()).toBeUndefined()

    expect(escort.get('random/value')).toBeUndefined()

    escort = new DataEscort('testId', 'testEvent', testObject)
    
    expect(escort.used).toEqual(testObject)
    expect(escort.get()).toEqual(testObject)
  })

  test('find data within object', () => {
    let escort = new DataEscort('testId', 'testEvent', testObject)
    expect(escort.isPrimitive).toBeFalsy()

    expect(escort.get('random/data')).toBeUndefined()
    expect(escort.get('object1')).toEqual(testObject.object1)
    expect(escort.get('object1/val1')).toBeFalsy()
    expect(escort.get('object1/val2')).toBe(testObject.object1.val2)
    expect(escort.get('object1/val3')).toBe(testObject.object1.val3)  
    expect(escort.get('object1/innerObject')).toEqual(testObject.object1.innerObject)

    escort = new DataEscort('testId', 'testEvent', testObject.object)
    expect(escort.isPrimitive).toBeFalsy()

    expect(escort.get('random/data')).toBeUndefined()
    expect(escort.get('val1')).toBeTruthy()
    expect(escort.get('val2')).toBe(testObject.object.val2)
    expect(escort.get('val3')).toBe(testObject.object.val3)
    expect(escort.get('object1/innerObject')).toBeUndefined()
  })

  test('find data within primitive', () => {
    let escort = new DataEscort('testId', 'testEvent', testObject.object.val1)
    
    expect(escort.isPrimitive).toBeTruthy()
    expect(escort.get('random/data')).toBeUndefined()
    expect(escort.get()).toBe(testObject.object.val1)
  })
})