import { useRef, useMemo } from "react"

const useMemoizedFn = (fn: CallableFunction) => {
  const lastFn = useRef(fn)

  const memoizedFn = useRef((...args: any[]) => {
    lastFn.current?.(args)
  })

  return memoizedFn.current
}

// function useMemoizedFn<T extends noop> (fn: T){
//   const fnRef = useRef<T>(fn)
//   fnRef.current = useMemo(() => fn, [fn])
//   const memoizedFn = useRef<PickFunction<T>>()
//   if(!memoizedFn.current){
//     memoizedFn.current = function(this, ...args) {
//       return fnRef.current.apply(this, args)
//     }
//   }

//   return memoizedFn.current as T 
// }


export default useMemoizedFn