import { Escort } from "../DataManager/DataEscort/DataEscort";
import { dataObject, finalData } from "../types/DataManager";

describe('Data Escort class', () => {
  const testObject = {
    object: {
      val1: true,
      val2: 'beta',
      val3: 1
    },

    object1: {
      val1: false,
      val2: 'omega',
      val3: -1,
      innerObject: {
        val1: false,
        val2: 'omega',
        val3: -1,
      }
    }
  }

  test('create instance', () => {
    let escort = new Escort('testId', 'testEvent')
    
    expect(escort.data).toBeUndefined()
    expect(escort.get()).toBeUndefined()

    escort = new Escort('testId', 'testEvent', testObject)
    
    expect(escort.data).toEqual(testObject)
    expect(escort.get()).toEqual(testObject)
  })

  test('find data', () => {
    let escort = new Escort('testId', 'testEvent', testObject)
    
    expect(escort.get('random/data')).toEqual(testObject)
    expect(escort.get('object1')).toEqual(testObject.object1)
    expect(escort.get('object1/val1')).toBeFalsy()
    expect(escort.get('object1/innerObject')).toEqual(testObject.object1.innerObject)
  })
})