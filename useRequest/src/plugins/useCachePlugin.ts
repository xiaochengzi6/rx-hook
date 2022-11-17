import { useRef } from 'react';
import useCreation from '../../../useCreation';
import useUnmount from '../../../useUnmount';
import type { Plugin } from '../types';
import * as cache from '../utils/cache';
import type { CachedData } from '../utils/cache';
import * as cachePromise from '../utils/cachePromise';
import * as cacheSubscribe from '../utils/cacheSubscribe';

// 会将当前请求成功的数据缓存起来。
// 下次组件初始化时，如果有缓存数据，我们会优先返回缓存数据，
// 然后在背后发送新请求，也就是 SWR 的能力
const useCachePlugin: Plugin<any, any[]> = (
  fetchInstance,
  {
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 8个多小时
    staleTime = 0,
    setCache: customSetCache,
    getCache: customGetCache,
  },
) => {
  const unSubscribeRef = useRef<() => void>();

  const currentPromiseRef = useRef<Promise<any>>();

  const _setCache = (key: string, cachedData: CachedData) => {
    // 如果是自定义的就使用自定义的
    if (customSetCache) {
      customSetCache(cachedData);
    } else {
      // 存储到 Map 中
      cache.setCache(key, cacheTime, cachedData);
    }
    // 如果设置了 key 就要去触发 key 监听函数
    cacheSubscribe.trigger(key, cachedData.data);
  };

  const _getCache = (key: string, params: any[] = []) => {
    if (customGetCache) {
      return customGetCache(params);
    }
    return cache.getCache(key);
  };

  // 创建一个唯一的实例 且不会随之更新永远是初始化的那个对象
  useCreation(() => {
    if (!cacheKey) {
      return;
    }

    // get data from cache when init
    // 初始化从缓存中取数据
    const cacheData = _getCache(cacheKey);
    // 取出的数据是保存在 data 中的
    if (cacheData && Object.hasOwnProperty.call(cacheData, 'data')) {
      fetchInstance.state.data = cacheData.data;
      fetchInstance.state.params = cacheData.params;

      // 当 新鲜时间 == -1 || 时间间隔 小于新鲜时间
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        // 状态设置为 false 
        fetchInstance.state.loading = false;
      }
    }

    // subscribe same cachekey update, trigger update
    // 订阅相同的cachekey更新，触发更新
    unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, (data) => {
      // 使整个组件更新
      fetchInstance.setState({ data });
    });
  }, []);

  // 组件卸载的时候执行
  useUnmount(() => {
    unSubscribeRef.current?.();
  });

  if (!cacheKey) {
    return {};
  }

  return {
    onBefore: (params) => {
      const cacheData = _getCache(cacheKey, params);

      if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
        return {};
      }

      // If the data is fresh, stop request
      // 返回 data && 停止 request 
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        return {
          loading: false,
          data: cacheData?.data,
          returnNow: true, // 组件已经有值
        };
      } else {
        // If the data is stale, return data, and request continue
        // 返回值 && 继续请求
        return {
          data: cacheData?.data,
        };
      }
    },
    onRequest: (service, args) => {
      let servicePromise = cachePromise.getCachePromise(cacheKey);

      // If has servicePromise, and is not trigger by self, then use it
      // 如果有servicePromise，并且不是由trigger触发的，那么使用它
      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        return { servicePromise };
      }

      servicePromise = service(...args);
      currentPromiseRef.current = servicePromise;
      cachePromise.setCachePromise(cacheKey, servicePromise);
      return { servicePromise };
    },
    onSuccess: (data, params) => {
      if (cacheKey) {
        // cancel subscribe, avoid trgger self
        unSubscribeRef.current?.();
        _setCache(cacheKey, {
          data,
          params,
          time: new Date().getTime(),
        });
        // resubscribe
        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, (d) => {
          fetchInstance.setState({ data: d });
        });
      }
    },
    onMutate: (data) => {
      if (cacheKey) {
        // cancel subscribe, avoid trgger self
        unSubscribeRef.current?.();
        _setCache(cacheKey, {
          data,
          params: fetchInstance.state.params,
          time: new Date().getTime(),
        });
        // resubscribe
        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, (d) => {
          fetchInstance.setState({ data: d });
        });
      }
    },
  };
};

export default useCachePlugin;
