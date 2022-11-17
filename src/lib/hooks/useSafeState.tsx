import { Dispatch, SetStateAction, useCallback, useState } from "react"
import useUnMountRef from "./useUnMountRef"

/**
 * 安全的改变状态，当组件卸载不会在通过 setState() 改变状态
 * @param initialValue 
 * @returns 
 */

function useSafeState<T>(initialValue: T | (()=>T)): [T, Dispatch<SetStateAction<T>>]

function useSafeState<T = undefined>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>]

function useSafeState<T>(initialValue?: T){
  const unmountRef = useUnMountRef()
  const [state, setState] = useState(initialValue)
  
  const setCurrentState = useCallback(()=>{
    if(unmountRef.current) return

    setState(initialValue)
  }, [])

  return [state, setCurrentState]
}

export default useSafeState