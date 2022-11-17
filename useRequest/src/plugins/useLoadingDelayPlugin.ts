import { useRef } from 'react';
import type { Plugin, Timeout } from '../types';

/**
 * 延迟 loading 变成 true 的时间 防止闪烁
 * @param fetchInstance 
 * @param param1 
 * @returns 
 */
const useLoadingDelayPlugin: Plugin<any, any[]> = (fetchInstance, { loadingDelay }) => {
  const timerRef = useRef<Timeout>();

  if (!loadingDelay) {
    return {};
  }

  const cancelTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    onBefore: () => {
      cancelTimeout();

      timerRef.current = setTimeout(() => {
        fetchInstance.setState({
          loading: true,
        });
      }, loadingDelay);

      return {
        loading: false,
      };
    },
    onFinally: () => {
      cancelTimeout();
    },
    onCancel: () => {
      cancelTimeout();
    },
  };
};

export default useLoadingDelayPlugin;
