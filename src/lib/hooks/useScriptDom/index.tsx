import { useEffect, useRef, useState } from "react";

type Options = {
  retry?: number;
  model?: string;
  onload?: () => void;
  onReject?: () => void;
  wait?: number;
}

type ErrorState = ErrorEvent | null
type ScriptState = HTMLScriptElement | null
const delayTimer = 3000

const createScriptDom = (src: string, model: string) => {
  const script = document.createElement('script')
  /* 兼容 html4 */
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

class CreateScriptEffect {

  constructor() {

  }

  // 创建、监听
  unScriptEffect(src: string, model: string) {

    useEffect(() => {
      const script = createScriptDom(src, model)

      script.addEventListener('load', handleLoad)
      script.addEventListener('error', handleError)
      document.body.appendChild(script)

      return () => {
        script.removeEventListener('load', handleLoad)
        script.removeEventListener('error', handleError)
      }
    })
  }

  createScriptDom(src: string, model: string) {
    const script = document.createElement('script')
    /* 兼容 html4 */
    script.type = 'text/javascript'
    model === 'defer'
      ? script.defer = true
      : script.async = true

    script.src = src

    return script
  }


}

function useScriptDom(src: string, options = {} as Options): [boolean, ErrorState] {
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

export default useScriptDom

// 参考文章 https://juejin.cn/post/6894629999215640583
// https://www.runoob.com/tags/tag-script.html