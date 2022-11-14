import { useRef } from "react"

const useMemoizedFn = (fn: CallableFunction) => {
  const lastFn = useRef(fn)

  const memoizedFn = useRef((...args: any[]) => {
    lastFn.current?.(args)
  })

  return memoizedFn.current
}


export default useMemoizedFn