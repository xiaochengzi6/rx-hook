import { useEffect, useRef, useState } from "react";
import useRafTimeout from "../useSetTimeout";

type Options = {
  retry?: number;
  model?: string;
  onload?: () => void;
  onReject?: () => void;
  wait?: number;
}

type ErrorState = ErrorEvent | null;
type ScriptState = HTMLScriptElement | null;

const delayTimer = 3000

function useScriptDom(src: string, options = {} as Options): [boolean, ErrorState] {
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
      // todo 重新加载
      useRafTimeout(() => {
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

// [参考文章](https://juejin.cn/post/6894629999215640583)
// https://www.runoob.com/tags/tag-script.html


