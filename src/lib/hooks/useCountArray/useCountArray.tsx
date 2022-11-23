import { useState } from "react";
import useMemoizedFn from "../useMemoizedFn";

interface Actions {
  inc: () => void;
  dec: () => void;
  del: (key: number) => void;
  clear: () => void;
  reset: () => void;

}
// 可能不合理 暂时放弃
export default function useCountArray(initialValue?: number[]) {
  const getInitialValue = () => {
    return initialValue && Array.isArray(initialValue) ? initialValue : []
  }
  const [array, setArray] = useState<number[]>(getInitialValue())

  const inc = () => setArray((preArr) => {
    const lastValue = preArr[preArr.length - 1] + 1 || 0
    return [...preArr, lastValue]
  })

  const del = (index: number) => setArray((preArr) => {
    const _array = preArr.slice(0, preArr.length)
    _array.splice(index, 1)
    return _array
  })

  const dec = () => setArray((preArr) => preArr.slice(0, -1))

  const clear = () => setArray([])

  return [
    array,
    {
      inc: useMemoizedFn(inc),
      del: useMemoizedFn(del),
      dec: useMemoizedFn(dec),
      clear: useMemoizedFn(clear)
    }
  ]
}
