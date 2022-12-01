import { Dispatch, SetStateAction, useEffect, useState } from "react"

type Callback<T> = (dispatch:  Dispatch<SetStateAction<T>>) => void

interface Action<T> {
  (boo: boolean, callback: Callback<T>): void
}

function useAnyState<T>(initailValue: T): [T, Action<T>]{
  const [state, setState] = useState(initailValue)

  const other:Action<T> = (boo, callback) => {
    !!boo ? callback(setState) : setState((prev) => prev)
  }
  return [state, other]
}

export default useAnyState

// https://www.cnblogs.com/fengyuqing/p/15074207.html 这个问题

// 我想应该可以理解为在判断出错的情况下也触发一次但这个值很显然是原来值，这样能确保顺序相同

// 使用方式
function App() {
  const [state, other] = useAnyState(0)
  const [counter, setCounter] = useState({})

  useEffect(()=>{
    other(Math.random() > 0.5, (dispatch)=>{
      dispatch((prev) => prev + 6)
    })
  }, [counter])

  return(
    <>
    <div>{state}</div>
    <button onClick={() => setCounter({})}>点击更新</button>
    </>

  )
}