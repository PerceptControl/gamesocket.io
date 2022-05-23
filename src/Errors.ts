import { socketId } from '.'

class TypeIs {
  public static string(entityName: string, value: unknown) {
    if (typeof value !== 'string') throw new TypeError(entityName, 'string', typeof value)
  }

  public static number(entityName: string, value: unknown) {
    if (typeof value !== 'number') throw new TypeError(entityName, 'number', typeof value)
  }

  public static boolean(entityName: string, value: unknown) {
    if (typeof value !== 'boolean') throw new TypeError(entityName, 'boolean', typeof value)
  }

  public static array(entityName: string, value: unknown) {
    if (!(value instanceof Array)) throw new TypeError(entityName, 'array', typeof value)
  }
}

class TypeError extends Error {
  constructor(entity: any, configType: string, getType: string) {
    var errorMessage = `${entity} shall have ${configType} type. Get ${getType}`
    super(errorMessage)
  }
}

class PathError extends Error {
  constructor(configPath: string, getPath: string) {
    var errorMessage = `Path parameter shall be ${configPath}. Get ${getPath}`
    super(errorMessage)
  }
}

class SocketDoesntExist extends Error {
  constructor(id: socketId) {
    var errorMessage = `Socket with id ${id} doesn't exist`
    super(errorMessage)
  }
}

var Functions = {
  isType: TypeIs,
}

var Custom = {
  type: TypeError,
  path: PathError,
  socketExist: SocketDoesntExist,
}

export default { Custom, Functions }
