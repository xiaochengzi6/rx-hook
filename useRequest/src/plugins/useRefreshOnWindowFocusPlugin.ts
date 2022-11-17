import { useEffect, useRef } from 'react';
import useUnmount from '../../../useUnmount';
import type { Plugin } from '../types';
import limit from '../utils/limit';
import subscribeFocus from '../utils/subscribeFocus';

/**
 * 屏幕聚焦重新请求
 * @param fetchInstance 
 * @param param1 
 * @returns 
 */
const useRefreshOnWindowFocusPlugin: Plugin<any, any[]> = (
  fetchInstance,
  // 默认时间间隔为 5000  
  { refreshOnWindowFocus, focusTimespan = 5000 },
) => {
  const unsubscribeRef = useRef<() => void>();

  const stopSubscribe = () => {
    unsubscribeRef.current?.();
  };

  useEffect(() => {
    if (refreshOnWindowFocus) {
      const limitRefresh = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan);
      // Focus 监听函数 当页面发生改变的时候就会触发该函数
      unsubscribeRef.current = subscribeFocus(() => {
        limitRefresh();
      });
    }
    // 当 组件销毁的时候开始调用该函数， 如果没有设置自然是一个空函数
    // 如果前面设置了就会在这里去触发提前监听
    return () => {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]);

  // 组件卸载的时候执行
  useUnmount(() => {
    stopSubscribe();
  });

  return {};
};

export default useRefreshOnWindowFocusPlugin;
