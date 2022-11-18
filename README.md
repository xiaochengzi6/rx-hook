## hook 设计规则

在处理传入的函数时通常会使用 `useLatest` 去包裹，以获得最新的函数。
~~~ts
function useLatest<T>(value: T){
  const ref = useRef<T>()
  ref.current = value

  return ref
} 
~~~
对于必要属性也可以这样使用来获取最新的值

hook返回的函数使用 `useMemoizedFn` 去包裹函数,这样就不用在deps中放入函数所依赖的属性，来避免`闭包陷阱` 并且返回的函数的地址不会随着更新改变 对于不需要依赖的函数可以使用 `useCallback()` 包裹

~~~ts
...
return [
  value,
  {
    get: useMemoizedFn(get),
    set: useMemoizedFn(set),
  }
]
...
~~~

参考: [ahooks 函数处理规范](https://ahooks.js.org/zh-CN/guide/blog/function/)

hook 就和函数一样，首先要确定其功能，进而考虑是否依赖外部状态也就是函数的参数，函数的参数数量尽量不要超过三个，对于
多参函数要抽离每个 hook 要考虑的东西都不一样就比如 `useDebounceFn` 来说它使用了lodash的 `debounce` 看一下 debounce 传入的参数 [`debounce(func, [wait=0], [options=])`](https://www.lodashjs.com/docs/lodash.debounce) 道理上都一样 那么 hook 就设计的和其相同就行,或者可以更简洁一点 `useDebounceFn(fn, options)` 

对于有多参且可选的函数 一般都会有多个函数签名用于校验 

hook 返回值通常被数组包裹 存在多个`action`将被放在对象中 `[value, {get, set}]` 
