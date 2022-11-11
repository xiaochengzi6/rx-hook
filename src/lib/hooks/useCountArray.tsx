import { useCallback, useMemo, useState } from "react";

interface Actions {
  increase: () => void,
  decrease: () => void,
  del: (key: number) => void,
  clear: () => void
}

type CountArrayType = [
  number[],
  Actions
]

export default function useCountArray(): CountArrayType {
  const [array, setArray] = useState<number[]>([])

  const increase = useCallback(() => setArray((preArr) => {
    const lastValue = preArr[preArr.length - 1] + 1 || 0
    return [...preArr, lastValue]
  }), [])

  const del = useCallback((index: number) => setArray((preArr) => {
    const _array = preArr.slice(0, preArr.length)
    _array.splice(index, 1)
    return _array
  }), [])

  const decrease = useCallback(() => setArray((preArr) => preArr.slice(0, -1)), [])

  const clear = useCallback(() => setArray([]), [])

  const actions = useMemo(() => {
    return {
      increase,
      del,
      decrease,
      clear
    }
  }, [increase, del, decrease, clear])

  return [array, actions]
}

/* -----------------测试------------------------
export default function TestCountArray () {
  const [countArray, actions] = useCountArray()
  const {increase, decrease, del, clear} = actions

  useEffect(()=>{
    console.log('countArray', countArray)
  },[countArray])
  return (
    <div>
      <button onClick={() => increase()}>increase</button>
      <button onClick={() => decrease()}>decrease</button>
      <button onClick={() => del(1)}>删除索引 1 </button>
      <button onClick={() => clear()}>清空</button>
    </div>
  )
}
*/