import { useState } from "react";
import useMemoizedFn from "./useMemoizedFn";

function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  const getInitialValue = () => {
    return initialValue === undefined ? new Map() : new Map(initialValue)
  } 

  const [map, setMap] = useState<Map<K, T>>(() => getInitialValue())

  const set = (key: K, value: T) => {
    setMap((prev)=>{
      const temp = new Map(prev)
      temp.set(key, value)
      return temp 
    })
  }

  const setAll = (newMap: Iterable<readonly [K, T]>) => {
    setMap(new Map(newMap))
  }

  const remove = (key: K) => {
    setMap((prev) => {
      const temp = new Map(prev)
      temp.delete(key)
      return temp
    })
  }

  const reset = () => setMap(getInitialValue())

  const get = (key: K) => map.get(key)

  return [
    map,
    {
      set: useMemoizedFn(set),
      setAll: useMemoizedFn(setAll),
      remove: useMemoizedFn(remove),
      reset: useMemoizedFn(reset),
      get: useMemoizedFn(get)
    }
  ] as const 
}

export default useMap