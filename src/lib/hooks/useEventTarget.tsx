import { isFunction } from "lodash"
import { useCallback, useState } from "react"
import useLatest from "./useLatest"

interface EventTarget<U> {
  target: {
    value: U 
  }
}

type Options<T, U> = {
  initialValue: T,
  transformer: (val: U) => T
}

/**
 * 获取表单控件的 Target 封装了 onChange 和 value 处理 e.target.value 值
 * 
 * options: {initialValue, transformer} 
 * 参数: initialValue 初始数据
 * 参数: transformer: (val: U) => val:T 将 value 做了一次转换 [自定义转换函数]
 * 
 * 使用: 
 * const [value, {onchange, reset}] = useEventTarget(options)
 * 
 * @param options 
 * @returns 
 */
function useEventTarget<T, U = T>(options?: Options<T, U>) {
  const { initialValue, transformer } = options || {}
  const [value, setValue] = useState(initialValue)

  // 持有传入的函数
  const transformerRef = useLatest(transformer)

  const reset = useCallback(() => { setValue(initialValue) }, [])

  const onChange = useCallback((e: EventTarget<U>)=>{
    const _value = e.target.value 

    // 如果有函数就会去调用
    if(isFunction(transformerRef.current)){
      setValue(transformerRef.current(_value))
    }

    return setValue(_value as unknown as T)
  },[])

  return [
    value,
    {
      reset,
      onChange
    }
  ] as const 
}

export default useEventTarget