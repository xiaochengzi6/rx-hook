import { isFunction } from "lodash"
import { useRef } from "react"
import { shallowEqual, simpleEqual } from "../utils"

type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean

/**
 * 取出上一次的状态
 * 1.
 * const preValue = usePrevious(state)
 *   参数: state 
 *   传入要"监听"的值 会比较前后传入的是否相等 默认使用 简单值比较
 * 2.
 * const preValue = usePrevious(state, strict)
 *   参数: strict: boolean 默认 false
 *   strict = true ==> 使用 浅层的对象比较 || strict = true ==> 使用 较为简单值比较
 * 3.
 * const preValue = usePrevious(state, update)
 *   参数: update: (A, B) => boolean 
 *   传入一个函数来代替默认比较函数
 * 
 * @param state any
 * @param update boolean | Function 
 * @returns boolean | undefined
 */
function usePrevious<T>(state: T): T | undefined

function usePrevious<T>(state: T, update: boolean): T | undefined

function usePrevious<T>(state: T, update: ShouldUpdateFunc<T>): T | undefined

function usePrevious<T>(state: T, update: boolean | ShouldUpdateFunc<T> = false) {
  const prevRef = useRef<T>()
  const currRef = useRef<T>()

  const shouldUpdate =
    isFunction(update)
      ? update
      : update
        ? shallowEqual
        : simpleEqual

  if (shouldUpdate(currRef.current, state)) {
    prevRef.current = currRef.current
    currRef.current = state
  }

  return prevRef.current
}

export default usePrevious
