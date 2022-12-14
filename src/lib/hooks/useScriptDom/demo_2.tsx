import { useEffect, useRef, useState } from "react";

interface extraParm {
  retry?: number;
  wait?: number;
  onload?: () => void;
  onerror?: () => void;
}

interface scriptResult extends extraParm {
  ref: Element;
  status: Status;
}

type Status = 'unset' | 'loading' | 'ready' | 'error';

export interface Options extends Partial<HTMLScriptElement & extraParm> { }

const delayTimer = 3000
const cacheScripts: Record<string, number> = {}
const update = () => { }

const createScriptDom = (path: string, props = {}): scriptResult => {
  const script = document.querySelector(`script[src=${path}]`)
  const { onload, onerror, wait = delayTimer, retry = 0 } = (props || {}) as Options
  const extraParam = { onload, onerror, wait, retry }

  if (!script) {
    const newScript = document.createElement('script')
    newScript.src = path

    Object.keys(props).forEach((key) => {
      // @ts-ignore
      newScript[key] = props[key]
    })

    newScript.setAttribute('data-status', 'loading')
    document.body.appendChild(newScript)

    return {
      ref: newScript,
      status: 'loading' as Status,
      ...extraParam
    }
  }

  return {
    ref: script,
    status: script.getAttribute('data-status') as Status || 'ready',
    ...extraParam
  }
}

const handler = (path: string, script: scriptResult | undefined) => (type: string) => {
  if(type === 'load'){
    script?.onload?.()
  }else {
    if (!script) { return }
    cacheScripts[path] -= 1
    const { retry, wait, onerror } = script
    if (retry) {

      setTimeout(() => {
        // 更新组件
        update()
      }, wait)
    }
    onerror?.()
  }
}

// 不合理之处 参数应该放到 cacheScript 中

function useScriptDom(path: string, options?: Options): Status {
  const [status, setStatus] = useState<Status>(path ? 'loading' : 'unset')

  const ref = useRef<Element>()

  useEffect(() => {
    if (!status) {
      return
    }

    const scriptDom = createScriptDom(path, options)
    const dealEvents = handler(path, scriptDom)
    ref.current = scriptDom.ref
    setStatus(scriptDom.status)

    if (!ref.current) {
      return
    }

    if (cacheScripts[path] === undefined) {
      cacheScripts[path] = 1
    } else {
      cacheScripts[path] += 1
    }

    const createEvent = (event: Event) => {
      const result = event.type === 'load' ? 'ready' : 'error'
      ref.current?.setAttribute('data-status', result)

      dealEvents(result)
      setStatus(result)
    }

    ref.current.addEventListener('load', createEvent);
    ref.current.addEventListener('load', createEvent);


    return () => {
      ref.current?.removeEventListener('load', createEvent);
      ref.current?.removeEventListener('load', createEvent);

      cacheScripts[path] -= 1
      if (cacheScripts[path] === 0) {
        ref.current?.remove()
      }
      ref.current = undefined
    }
  }, [path])

  return status
}

export default useScriptDom
