import { useCallback, useLayoutEffect, useRef } from "react";

export default function useEvent(handler: () => void) {
  const handlerRef = useRef<any>(null)

  useLayoutEffect(() => {
    handlerRef.current = handler
  })

  return useCallback((...args: any[])=>{
    const fn = handlerRef.current
    return fn(...args)
  }, [])
}

// @see useEvent: https://segmentfault.com/a/1190000041798153