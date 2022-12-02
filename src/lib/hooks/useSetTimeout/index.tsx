import { useEffect } from "react"
import { isNumber } from "../../utils"

export interface Timeout {
  id: number | NodeJS.Timeout
}

export const setRafTimeout = (callback: () => void, delay: number): Timeout => {
  if(typeof requestAnimationFrame === typeof undefined){
    return {
      id: setTimeout(callback, delay)
    }
  }

  const timeout = {
    id: 0
  }

  const startTime = +new Date()
  const loop = () => {
    const current = +new Date()
    if(current - startTime > delay){
      callback()
    }else{
      timeout.id = requestAnimationFrame(loop)
    }
  }
  timeout.id = requestAnimationFrame(loop)
  return timeout
}

const checkCancelAnimation = (t: any): t is NodeJS.Timer => {
  return typeof cancelAnimationFrame === typeof undefined
} 

export const clearRafTimeout = (timeout?: Timeout) => {
  if(!timeout) return 
  if(checkCancelAnimation(timeout.id)){
    return clearTimeout(timeout.id)
  }
  cancelAnimationFrame(timeout.id)
}


function useRafTimeout(callback: () => void, delay: number | undefined) {
  useEffect(()=>{
    if(!isNumber(delay)) return 

    const timer = setRafTimeout(() => {
      callback()
    }, delay)

    return () => {
      clearRafTimeout(timer)
    }
  }, [delay])
}

export default useRafTimeout