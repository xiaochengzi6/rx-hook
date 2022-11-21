// import { setInterval } from "timers"

// import isObject from './isObject.js'
const isObject = (val) => typeof val === 'object'
// import root from './.internal/root.js'

function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    // debounced函数每次被调用时所记录的时间。
    lastCallTime

  // func 函数最近一次执行时所记录的时间。
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  // const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  // 立即调用函数
  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    // if (useRAF) {
    //   root.cancelAnimationFrame(timerId)
    //   return root.requestAnimationFrame(pendingFunc)
    // }
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    // if (useRAF) {
    //   return root.cancelAnimationFrame(id)
    // }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    // 记录最后一次调用 func 的时间
    lastInvokeTime = time
    // 开启定时器在 wait 后调用 timerExpired 函数 
    timerId = startTimer(timerExpired, wait)
    // 是否是立即调用函数
    return leading ? invokeFunc(time) : result
  }

  // 计算剩余剩余事件
  function remainingWait(time) {
    // 当前时间 - debounced 函数最后一次执行的时间
    const timeSinceLastCall = time - lastCallTime
    // 当前时间 - func 函数最后执行的时间 
    const timeSinceLastInvoke = time - lastInvokeTime
    // 剩余时间间隔
    const timeWaiting = wait - timeSinceLastCall

    // 如果有 maxing 说明是节流函数 
    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  // 是否去调用函数
  function shouldInvoke(time) {
    // 当前时间和上一次调用时间相减
    const timeSinceLastCall = time - lastCallTime
    // 当前时间和 最后返回的调用函数的时间
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    // 1. 第一次被调用
    // 2. 触发函数结束时，达到了trailingEdge 边界条件

    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      // 满足调用条件就调用该函数
      return trailingEdge(time)
    }
    // 不满足就开启一个定时器延迟 remainingWait(time) 时间后执行 timerExpired 
    // remainingWait 去计算剩余时间 在剩余时间后执行 timerExpired 函数
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    // lastArgs 意味着 func 至少要执行一次
    // 并且满足 trailing配置 (等待 wait 才能调用函数)
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    // 是否调用
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      // 初次执行
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      // 节流函数 
      if (maxing) {
        // isInvoking 成立说明 时间间隔大于 wait 并且 timerId 还存在的基础上重新设置 并且 立即运行一次
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    // 不断的触发 debounced 函数 但是又不满足 isInvoking 状态
    //  timerId 没有绑定回调事件 就会在这里绑定
    // 执行完上一次 回调函数，timerId = undefined 下一次调用 debounced 调用就会到这里
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }

    // 返回追后结果值 
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

// export default debounce
let count = 1
const debounced = debounce(function () {
  count++
  console.log('触发debounce', count)
},
  1000,
  {
    // 'leading': true,
    'trailing': true
  }
)

debounced()

setTimeout(function () {
  debounced()
}, 200)

setTimeout(function () {
  debounced()
}, 200)

setTimeout(function () {
  debounced()
}, 200)

setTimeout(function () {
  debounced()
}, 200)

// 参考 https://juejin.cn/post/6934149265153343496#heading-6

// 节流 
// 节流的定义: 触发事件过 wait 才能运行函数
// 简单的写法
function debounce(callback, wait) {
  var timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(callback, wait)
  }
}
// 但是会重复的去调用 setTimeout 和 clearTimeout 
// lodash 中会在第一次触发事件的时候 timerId = setTimeout(callback, wait)
// 之后会去判断如果存在 timerId 就不会触发事件 等延迟到 wait 后会执行 callback 并判断最近一次运行 debounced 
// 的时间 在此基础上去延迟 [wait - (现在时间 - 上一次运行的时间)]后运行函数

// 防抖
// 防抖的定义: 触发事件 >=wait 秒触发一次函数
// lodash 函数在节流的基础上 增加了一个字段 maxing 当设置 maxWait 的时候就会为 true 然后
// 有事件触发就会延迟 wait 执行 当延迟到wait 后会去判断 [上一次调用传入的函数的时间 - 当期时间] 是否大于 maxWait
// 如果大于或等于 就执行运行