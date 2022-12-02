import { useEffect, useRef, useState } from "react";
import { clearRafTimeout, setRafTimeout } from "../useSetTimeout";

interface Timeout {
  id: number | NodeJS.Timeout
}

type Options = {
  retry?: number;
  model?: string;
  onload?: () => void;
  onReject?: () => void;
  wait?: number;
}

type ErrorState = ErrorEvent | null;
type UnScriptEffect = (src: string, model: string) => void;

const delayTimer = 3000

function checkExisting(src: string): boolean
function checkExisting(src: string, isReturn: boolean): HTMLElement
function checkExisting(src: string, isReturn?: boolean): HTMLElement | boolean {
  const existing: HTMLScriptElement | null = document.querySelector(
    `script[src='${src}']`
  )

  if (isReturn && existing) {
    return existing
  }

  if (existing) {
    return true
  }

  return false
}

class CreateScript {
  onLoadFn = () => { }
  onErrorFn = () => { }
  constructor(onLoadFn: () => void, onErrorFn: () => void) {
    this.onLoadFn = onLoadFn
    this.onErrorFn = onErrorFn
  }

  unScriptEffect(src: string, model: string) {
    this.removeElementError(src)

    const script = this.createScriptDom(src, model)

    script.onload = this.onLoadFn
    script.onerror = this.onErrorFn

    document.body.appendChild(script)
  }

  createScriptDom(src: string, model: string) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    model === 'defer'
      ? script.defer = true
      : script.async = true

    script.src = src

    return script
  }

  removeElementError(src: string) {
    const lastScript = checkExisting(src, true)
    if (lastScript) {
      document.body.removeChild(lastScript)
    }
  }
}

function useScriptDom(src: string, options = {} as Options): [boolean, ErrorState] {
  const { retry = 3, model = 'defer', wait = delayTimer } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState>(null)

  const retryCount = useRef(retry)
  const unScriptRef = useRef<UnScriptEffect>()
  const timerRef = useRef<Timeout>()

  if (checkExisting(src)) {
    // todo 页面上 但是没有加载出来 该怎么办？
    // 请求数据失败就开始正常流程 
    // 成功然后缓存一下数据？？(可行吗？) 或者查看缓存是否有数据？(这里要确定数据能否被我们给返回) 然后让状态变成 loading: true 
    !loading && setLoading(true)
  }

  const handleLoad = () => {
    setLoading(true)
  }

  const handleError = () => {
    if (retryCount.current > 0) {
      retryCount.current--
      timerRef.current = setRafTimeout(() => {
        unScriptRef.current?.(src, model)
      }, wait)
    } else {
      setError(error)
    }
  }

  useEffect(() => {
    if (loading) return
    const scriptObj = new CreateScript(handleLoad, handleError)
    unScriptRef.current = scriptObj.unScriptEffect.bind(scriptObj)
    unScriptRef.current(src, model)
  }, [])

  useEffect(() => {
    return () => {
      clearRafTimeout(timerRef.current)
    }
  })

  return [loading, error]
}

export default useScriptDom
