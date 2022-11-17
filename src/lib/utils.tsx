const has = Object.prototype.hasOwnProperty

export const Waring = (value: any, message?: string) => {
  if (value === false || value === null || typeof value === 'undefined') {
    console.error(message)
  }
}

// 当 invariant 判别条件为 false 时，会将 invariant 的信息作为错误抛出
export const invariant = (value: any, message?: string) => {
  if (!value) {
    return new Error(message)
  }
}

export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isBoolean = (val: unknown): val is Boolean => typeof val === 'boolean'

const is = (x: any, y: any) => {
  if (x === y) {
    // +0 !== -0
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  }
  // 判断 NAN 
  return x !== x && y !== y
}

// 浅层对象比较
export function shallowEqual<A, B>(objA: A, objB: B) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null
    || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object(objA)
  const keysB = Object(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0, len = keysA.length; i < len; i++) {
    if (
      !has.call(objB, keysA[i])
      || !is(keysA[i], keysB[i])
    ) {
      return false
    }
  }

  return true
}

// 简单类型值比较
export function simpleEqual<T>(a?: T, b?: T) {
  return !Object.is(a, b)
}


export function identity<T>(x: T) {return x}