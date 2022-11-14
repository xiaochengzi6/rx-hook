import { DependencyList, EffectCallback, useEffect, useRef } from "react";

function isFirstRender() {
  const state = useRef(true)

  if (state.current) {
    state.current = false
    return true
  }

  return state
}


const useUpdateEffect = (callback: EffectCallback, deps: DependencyList): void => {
  const isFirst = isFirstRender()

  useEffect(() => {
    !isFirst && callback
  }, deps)
}

export default useUpdateEffect
