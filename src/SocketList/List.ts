/**
 * Структура данных, выполняющая функции массива и соверщающая дополнительные оптимизации.
 * @template {Object}T тип хранимых объектов
 */
export class List<T extends Object> {
  /** Массив внутренних элементов, которые доступны только наследникам */
  protected _elements: Array<T | undefined> = new Array()
  /**
   * Специальное значение, которое используется для определения свободных мест внутри массива
   * в случае, если будет указан настраеваемый undefined, движок V8 сможет сделать дополнительные оптимизации
   */
  protected _undefined: undefined | T

  /**
   * Задает массиву начальный размер и запаолняет его {@link List._undefined | 'List._undefined'}
   */
  constructor(undefinedValue?: T) {
    if (undefinedValue) this._undefined = undefinedValue
  }

  /** Генератор значений элементов. Возвращает любые значения, которые не равны {@link List._undefined | 'List._undefined'} */
  public *values() {
    let index = 0
    while (index < this._elements.length) {
      if (this._elements[index] != this._undefined) yield this._elements[index++]
      else index++
    }
  }

  /**
   * Добавляет набор новых элементов типа T.
   * @return false, если один из элементов оказался {@link List._undefined} и добавляет остальные элементы. true в остальных случаях
   */
  public add(...elements: Array<T>) {
    let status = true

    for (let index = 0; index < elements.length; index++) {
      if (elements[index] == this._undefined) status = false
      this._elements[this.freeSpace] = elements[index]
    }
    return status
  }

  /**
   * Добавляет элеммент типа T.
   * @return -1, если один из элементов оказался {@link List._undefined} или index вставленного объекта в случае успеха.
   */
  public addOne(element: T) {
    if (element == this._undefined) return -1

    let index = this.freeSpace
    this._elements[index] = element

    return index
  }

  /**
   * Удаляет набор элемментов типа T.
   * @returns false, если один из элементов оказался {@link List._undefined} или он не был найден в {@link List._elements} и удаляет остальные элементы. true в остальных случаях
   */
  public delete(...elements: Array<T>) {
    let status = true
    for (let index = 0; index < elements.length; index++) {
      if (elements[index] == this._undefined) status = false

      let tmp = this._getElement(elements[index])
      if (!~tmp) status = false

      this._elements[tmp] = this._undefined
    }
    return status
  }

  public indexOf(element: T) {
    return this._elements.indexOf(element)
  }

  public valueOf(index: number) {
    return this._elements[index] ?? this._undefined
  }

  public isUndefined(index: number) {
    if (this._elements[index] && this._elements[index] != this._undefined) return false
    return true
  }

  /**
   * @returns индекс свободной позиции внутри массива.
   */
  public get freeSpace(): number {
    var indexOfFreeSpace = this._hasFreeSpace

    if (!~indexOfFreeSpace) return this._elements.length
    return indexOfFreeSpace
  }

  /**
   * @returns true, если внутри {@link List._elements} есть хотя бы один элемент вида {@link List._undefined}
   */
  protected get _hasFreeSpace() {
    return this._elements.indexOf(this._undefined)
  }

  /**
   *
   * @param объект, который нужно найти
   * @returns индекс найденного объекта или -1
   */
  protected _getElement(element: T) {
    for (let i = 0; i < this._elements.length; i++) {
      if (this._elements[i] == element) return i
    }
    return -1
  }
}
