import { DependencyList, EffectCallback, useEffect, useState } from "react";
import { DebounceOptions } from "./useDebounce";
import useDebounceFn from "./useDebounceFn";
import useUpdateEffect from "./useUpdateEffect";

function useDebounceEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions
) {
  const [flag, setFlag] = useState({})

  const { run } = useDebounceFn(() => {
    setFlag({})
  }, options)

  useEffect(() => {
    return run()
  }, deps)

  // 事件触发的时机为更新阶段
  useUpdateEffect(effect, [flag])
}

export default useDebounceEffect