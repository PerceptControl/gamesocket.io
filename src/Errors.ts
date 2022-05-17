export class TypeError extends Error {
  constructor(entity: any, configType: string, getType: string) {
    var errorMessage = `${entity} shall have ${configType} type. Get ${getType}`
    super(errorMessage)
  }
}

export class PathError extends Error {
  constructor(configPath: string, getPath: string) {
    var errorMessage = `Path parameter shall be ${configPath}. Get ${getPath}`
    super(errorMessage)
  }
}
