import debounce from "lodash/debounce";
import { useMemo } from "react";
import { DebounceOptions } from "./useDebounce";
import useLatest from "./useLatest";
import useUnmount from "./useUnmount";

type noop = (...args: any) => any 

function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
  const fnRef = useLatest(fn)

  const wait = options?.wait ?? 1000

  const debounced = useMemo(
    () => 
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args)
        },
        wait,
        options,
      ),
    []
  )
  
  // 组件卸载的时候执行
  useUnmount(
    () => {
      debounced.cancel()
    }
  )

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush
  }
}

export default useDebounceFn