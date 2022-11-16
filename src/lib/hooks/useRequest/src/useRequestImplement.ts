import useCreation from '../../useCreation';
import useLatest from '../../useLatest';
import useMemoizedFn from '../../useMemoizedFn';
import useMount from '../../useMount';
import useUnmount from '../../useUnmount';
import useUpdate from '../../useUpdate';

import Fetch from './Fetch';
import type { Options, Plugin, Result, Service } from './types';

function useRequestImplement<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams> = {},
  plugins: Plugin<TData, TParams>[] = [],
) {
  const { manual = false, ...rest } = options;

  const fetchOptions = {
    manual,
    ...rest,
  };

  const serviceRef = useLatest(service);

  const update = useUpdate();

  // 生一个请求实例(地址不会改变)
  const fetchInstance = useCreation(() => {
    // 过滤掉值为 null, undefined, false, 0, '', NaN 排除假值
    // 触发 hook 这里的 hook 是 onInit 阶段
    const initState = plugins.map((p) => p?.onInit?.(fetchOptions)).filter(Boolean);

    return new Fetch<TData, TParams>(
      serviceRef,
      fetchOptions,
      // 更新组件
      update,
      Object.assign({}, ...initState),
    );
  }, []);
  fetchInstance.options = fetchOptions;
  // run all plugins hooks
  // 执行所有的 plugin, 每个 Plugin 都返回对象，对象存储不同阶段的方法等待这调用, 存储在 fetchInstance.pluginImpls 数组中
  fetchInstance.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions));

  // 初始化的时候执行 Effect
  useMount(() => {
    if (!manual) {
      // useCachePlugin can set fetchInstance.state.params from cache when init
      const params = fetchInstance.state.params || options.defaultParams || [];
      // @ts-ignore
      fetchInstance.run(...params);
    }
  });

  // 卸载的时候执行
  useUnmount(() => {
    fetchInstance.cancel();
  });

  return {
    // 属性
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    // 方法
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
  } as Result<TData, TParams>;
}

export default useRequestImplement;
