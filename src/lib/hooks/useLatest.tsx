import { useRef } from "react";

// 返回最新的函数 通常会使用 useLatest 去包裹传入的函数 
function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value

  return ref
}

export default useLatest