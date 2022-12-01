import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Options = {
  retry?: number;
  model?: string;
  onload?: () => void;
  onReject?: () => void;
  wait?: number;
}

type ErrorState = ErrorEvent | null;
type ScriptState = HTMLScriptElement | null;
type UnScriptEffect = (src: string, model: string) => void;

const delayTimer = 3000

function checkExisting(src: string): boolean
function checkExisting(src: string, isReturn: boolean): HTMLElement
function checkExisting(src: string, isReturn?: boolean): HTMLElement | boolean {
  const existing: HTMLScriptElement | null = document.querySelector(
    `script[src='${src}']`
  )

  if(isReturn && existing){
    return existing
  }
  
  if(existing){
    return true 
  }

  return false
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

function useScriptDom_2(src: string, options = {} as Options): [boolean, ErrorState] {
  const { retry = 3, model = 'defer', wait = delayTimer } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState>(null)

  const retryCount = useRef(retry)
  const unScriptRef = useRef<UnScriptEffect>()

  if (checkExisting(src)) {
    !loading && setLoading(true)
  }

  const handleLoad = () => {
    setLoading(true)
  }

  const handleError = () => {
    if (retryCount.current > 0) {
      retryCount.current--
      setTimeout(() => {
        unScriptRef.current?.(src, model)
      }, wait)
    } else {
      setError(error)
    }
  }

  useEffect(() => {
    const scriptObj = new CreateScript(handleLoad, handleError)
    unScriptRef.current = scriptObj.unScriptEffect.bind(scriptObj)

    unScriptRef.current(src, model)

    return () => {
      scriptObj.removeElementError(src)
    }
  }, [])

  return [loading, error]
}


function useScriptDom_1(src: string, options = {} as Options): [boolean, ErrorState] {
  // =========================
  const createScriptDom = (src: string, model: string) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    model === 'defer'
      ? script.defer = true
      : script.async = true

    script.src = src

    return script
  }

  const checkExisting = (src: string) => {
    const existing: HTMLScriptElement | null = document.querySelector(
      `script[src='${src}']`
    )

    return existing ? true : false
  }
  // =========================
  const { retry = 3, model = 'defer', wait = delayTimer } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState>(null)

  const retryCount = useRef(retry)
  const scriptRef = useRef<ScriptState>(null)

  const handleLoad = () => {
    setLoading(true)
    console.log('加载成功')
  }
  const handleRetry = () => {
    const script = createScriptDom(src, model)

    // todo 这里还需要重新再去绑定事件才行
    document.body.appendChild(script)
  }

  const handleError = (error: ErrorEvent) => {
    if (retryCount.current >= 0) {
      // 考虑使用 useSetTimeout 包裹
      retryCount.current--
      setTimeout(() => {
        // todo 重新加载
        handleRetry()
      }, wait)
    } else {
      setError(error)
    }
    console.log('加载失败', error)
  }

  if (checkExisting(src)) {
    console.log('在页面上存在')
    !loading && setLoading(true)
  }

  useEffect(() => {
    // 若页面上有该文件就直接返回
    // todo 这里还需要确定添加到页面是是否等于加载成功
    // 页面上存在也不能说明添加成功
    if (loading || error) return

    scriptRef.current = createScriptDom(src, model)
    const { current: script } = scriptRef
    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)
    handleRetry()

    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }
  })

  return [loading, error]
}

export default useScriptDom_2

// 参考文章 https://juejin.cn/post/6894629999215640583
// https://www.runoob.com/tags/tag-script.html