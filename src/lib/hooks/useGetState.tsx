import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

type GetCountAction<T> = () => T

function useGetState<T>(initialState: T | (()=> T)): [T, Dispatch<SetStateAction<T>>, GetCountAction<T>]

function useGetState<T = undefined>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>, GetCountAction<T>]

function useGetState<T>(initialState?: T){
  const [state, setState] = useState(initialState)
  const StateRef = useRef(state)
  StateRef.current = state
  const getCount = useCallback(() => StateRef.current, [])

  return [state, setState, getCount]
}

export default useGetState