import { useState } from "react";
import useMemoizedFn from "../useMemoizedFn";

interface Actions {
  inc: () => void;
  dec: () => void;
  del: (key: number) => void;
  clear: () => void;
  reset: () => void;
}

type Options = {
  length?: number;
  step?: number;
  max?: number;
  min?: number;
}

function useCountArray(options: Options = {}): [any[], Actions] {
  const { length = 0, step = 1 } = options

  const __array = new Array(length).fill(0).map((_, i) => i)
  const [array, setArray] = useState(__array)

  const inc = () => setArray((prevArr) => {
    const lastValue = prevArr[prevArr.length - 1] || 0
    return [...prevArr, lastValue + step]
  })

  const del = (index: number) => setArray((preArr) => {
    const _array = preArr.slice(0, preArr.length)
    _array.splice(index, 1)
    return _array
  })

  const dec = () => setArray((preArr) => preArr.slice(0, -1))

  const clear = () => setArray([])

  const reset = () => setArray(__array)

  return [
    array,
    {
      inc: useMemoizedFn(inc),
      del: useMemoizedFn(del),
      dec: useMemoizedFn(dec),
      clear: useMemoizedFn(clear),
      reset: useMemoizedFn(reset)
    }
  ]
}

