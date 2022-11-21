import { useMemo } from "react"
import useToggle from "../useToggle"


interface Actions {
  toggle: () => void;
  set: (v: any) => void;
  setTrue: () => void;
  setFalse: () => void;
}

function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle, set }] = useToggle(defaultValue)

  const actions: Actions = useMemo(() => {
    const setTrue = () => set(true)
    const setFalse = () => set(false)
    return {
      toggle,
      set: (v) => set(!!v),
      setTrue,
      setFalse
    }
  }, [])

  return [state, actions]
}

export default useBoolean

// test @see https://juejin.cn/post/7152709386752753701