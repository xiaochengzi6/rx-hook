import { useEffect, useRef, useState } from "react";
import { isNumber } from "../../utils";
import { clearRafTimeout, setRafTimeout } from "../useSetTimeout";

interface Timeout {
  id: number | NodeJS.Timeout
}

export interface Options extends Partial<HTMLScriptElement> {
  retry?: number;
  wait?: number;
  onload?: () => void;
  onerror?: () => void;
}

type ErrorState = ErrorEvent | null;
type UnScriptEffect = (src: string, model: string) => void;

const delayTimer = 3000

function checkExisting(src: string, isReturn?: boolean): HTMLElement | boolean {
  const existing: HTMLScriptElement | null = document.querySelector(
    `script[src='${src}']`
  )

  return (
    isReturn
      ? (existing ? existing : false)
      : false
  )
}

class CreateScript {
  onLoadFn
  onErrorFn
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

  // 如果 <script> 存在就不再创建
  if (checkExisting(src)) {
    !loading && setLoading(true)
  }

  const handleLoad = () => {
    setLoading(() => {
      console.log('loading: true')
      return true
    })
  }

  const handleError = () => {
    if (
      isNumber(retryCount.current)
      && retryCount.current > 0
      && isNumber(wait)
    ) {
      retryCount.current--
      timerRef.current = setRafTimeout(() => {
        // retry 
        unScriptRef.current?.(src, model)
      }, wait)
    } else {
      setError(error)
    }
  }

  useEffect(() => {
    // loading 存在说明不需要再创建了
    if (loading) return
    const scriptObj = new CreateScript(handleLoad, handleError)
    unScriptRef.current = scriptObj.unScriptEffect.bind(scriptObj)
    unScriptRef.current(src, model)

    return () => {
      // 如果再请求的过程中提前卸载组件就取消
      clearRafTimeout(timerRef.current)
    }
  }, [])

  return [loading, error]
}

export default useScriptDom
