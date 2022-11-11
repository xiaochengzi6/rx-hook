import { useCallback, useEffect, useState } from "react";

interface OutUseMapType {
  map: object
  size: number
  get: (key: any) => any
  has: (key: any) => boolean
  set: (key: any, value: object) => void
  del: (key: any) => any
  clear: () => void
  forEach: (func: (value: object, key: any) => void) => void
  keys: () => any[]
}

type MapType = {
  [key: string]: any
}

export default function useMap(): OutUseMapType {
  const [map, setMap] = useState<MapType>({})
  const [size, setSize] = useState(0)

  const get = (key: string) => map[key]

  const set = useCallback(
    (key: string, value: any) => setMap((preMap) => ({ ...preMap, [key]: value })), 
    []
  )

  const has = (key: string) => Object.prototype.hasOwnProperty.call(map, key)

  const del = useCallback(
    (key: string) => setMap(({ [key]: value, ...restObj }) => ({ ...restObj })),
    []
  )

  const clear = useCallback(() => setMap({}), [])

  const forEach = (func: (value: any, key: string) => void) => {
    const keys = Object.keys(map)
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i]
      func.call(map, map[key], key)
    }
  }

  const keys = () => Object.keys(map)

  useEffect(() => {
    if (Object.keys(map).length !== size) {
      const newSize = Object.keys(map).length
      setSize(newSize)
    }
  }, [map])

  return {
    map,
    size,
    get,
    set,
    has,
    del,
    clear,
    forEach,
    keys
  }
}
