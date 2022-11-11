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
  const length = useMemo(() => array.length, [array])

  const increase = () => setArray((preArr) => {
    const lastValue = preArr[length - 1] || 0
    return [...preArr, lastValue + 1]
  })

  const del = (index: number) => {
    const _array = array.slice(0, length) 
    _array.splice(index, 1)
    return setArray(_array)
  }

  const decrease = () => setArray((preArr) => preArr.slice(0, length - 1))

  const clear = useCallback(() => setArray([]), [])

  const actions = {
    increase,
    del,
    decrease,
    clear
  }

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