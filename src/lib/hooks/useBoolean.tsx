import { useMemo } from "react"
import useToggle from "./useToggle"


interface Actions {
  toggle: () => void;
  set: (v: any) => void;
  setTrue: () => void;
  setFalse: () => void;
}

function useBoolean(defaultValue = false) {
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