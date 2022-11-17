import { useEffect, useRef } from "react"
/**
 * 获取当前组件是否卸载
 * @returns boolean
 */
function useUnMountRef () {
  const unmountedRef = useRef(false)

  useEffect(()=>{
    unmountedRef.current = false 
    return () => {
      unmountedRef.current = true
    }
  }, [])

  return unmountedRef
}

export default useUnMountRef