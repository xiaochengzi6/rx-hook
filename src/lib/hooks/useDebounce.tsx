import { useEffect, useState } from "react";
import useDebounceFn from "./useDebounceFn";

export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * 防抖函数
 * 用法: const [value, setValue] = useDebounce<String>()
 * 
 * @param value 监听 value 的值
 * @param options 
 * @returns 
 */
function useDebounce<T>(value: T, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value)

  const { run } = useDebounceFn(()=>{
    setDebounced(value)
  }, options)

  useEffect(()=>{
    run()
  }, [value])

  return [debounced, setDebounced]
}

export default useDebounce