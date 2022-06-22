type voidOut = void | Promise<void>

export declare interface ILogger {
  info: (data: string) => voidOut
  debug: (data: string) => voidOut
  trace: (data: string) => voidOut
  warn: (data: string) => voidOut
  error: (data: string) => voidOut
  fatal: (data: string) => voidOut
}

class Logger {
  private static _logger: ILogger = {
    info: console.info,
    debug: console.debug,
    trace: console.trace,
    warn: console.warn,
    error: console.error,
    fatal: (error: string) => {
      throw new Error(error)
    },
  }

  static get info() {
    return this._logger.info
  }
  static get debug() {
    return this._logger.debug
  }
  static get trace() {
    return this._logger.trace
  }
  static get warn() {
    return this._logger.warn
  }
  static get error() {
    return this._logger.error
  }

  static get fatal() {
    return this._logger.fatal
  }

  static set info(fn: any) {
    this._logger.info = fn
  }
  static set debug(fn: any) {
    this._logger.debug = fn
  }
  static set trace(fn: any) {
    this._logger.trace = fn
  }
  static set warn(fn: any) {
    this._logger.warn = fn
  }
  static set error(fn: any) {
    this._logger.error = fn
  }

  static set fatal(fn: any) {
    this._logger.fatal = fn
  }

  public static set(newLogger: ILogger, newLoggerContextNeeded: boolean = false) {
    if (newLoggerContextNeeded) {
      this.info = newLogger.info.bind(newLogger)
      this.debug = newLogger.debug.bind(newLogger)
      this.trace = newLogger.trace.bind(newLogger)
      this.warn = newLogger.warn.bind(newLogger)
      this.error = newLogger.error.bind(newLogger)
    } else {
      this.info = newLogger.info
      this.debug = newLogger.debug
      this.trace = newLogger.trace
      this.warn = newLogger.warn
      this.error = newLogger.error
    }
  }

  public static flags = {
    info: false,
    debug: false,
    trace: true,
    warn: true,
  }
}

export default Logger
