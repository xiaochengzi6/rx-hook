import { useEffect } from "react"
import useLatest from "./useLatest"

// 卸载的时候执行 fn 
function useUnmount(fn: () => void) {
  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      fnRef.current()
    },
    []
  )
}

export default useUnmount 