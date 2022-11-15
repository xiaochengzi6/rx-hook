import { useState } from "react"
import { isNumber } from "../utils"
import useMemoizedFn from "./useMemoizedFn";

export interface Options {
  min?: number,
  max?: number
}

export type ValueParam = number | ((c: number) => number)

export interface Actions {
  inc: (delta?: number) => void;
  dnc: (delta?: number) => void;
  set: (value: number | ((c: number) => number)) => void;
  reset: () => void
}

function getTargetValue(val: number, options: Options) {
  const { min, max } = options
  let target = val
  if (isNumber(min)) {
    target = Math.max(min, val)
  }
  if (isNumber(max)) {
    target = Math.min(max, val)
  }

  return target
}

function useCounter(initialValue: number = 0, options: Options = {}) {
  const { min, max } = options

  const [current, setCurrent] = useState(() => {
    return getTargetValue(initialValue, {
      min,
      max
    })
  })

  const setValue = (value: ValueParam) => {
    setCurrent((c) => {
      const target = isNumber(value) ? value : value(c)
      return getTargetValue(target, {
        min,
        max
      })
    })
  }

  const inc = (delta: number = 1) => {
    setValue((c) => c + delta)
  }

  const dec = (delta: number = 1) => {
    setValue((c) => c - delta)
  }

  const set = (value: ValueParam) => {
    setValue(value)
  }

  const reset = () => {
    setValue(initialValue)
  }

  return [
    current,
    {
      inc: useMemoizedFn(inc),
      dec: useMemoizedFn(dec),
      reset: useMemoizedFn(reset),
      set: useMemoizedFn(set)
    }
  ] as const
}


export default useCounter