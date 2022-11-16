import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect';
import type { Plugin, Timeout } from '../types';
import isDocumentVisible from '../utils/isDocumentVisible';
import subscribeReVisible from '../utils/subscribeReVisible';

const usePollingPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { pollingInterval, pollingWhenHidden = true },
) => {
  const timerRef = useRef<Timeout>();
  const unsubscribeRef = useRef<() => void>();

  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // 如果有值就会触发 在 onBefore 阶段 触发监听函数
    unsubscribeRef.current?.();
  };

  // 更新阶段 没有 pollingInterval 就会返回 停止轮询
  useUpdateEffect(() => {
    if (!pollingInterval) {
      stopPolling();
    }
  }, [pollingInterval]);

  if (!pollingInterval) {
    return {};
  }

  return {
    onBefore: () => {
      stopPolling();
    },
    onFinally: () => {
      // if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
      // 页面还未被隐藏的时候 && pollingWhenHidden == false 
      // 设置监听函数
      // 可以使页面在最小化的时候停止触发 轮询，页面恢复在触发轮询
      if (!pollingWhenHidden && !isDocumentVisible()) {
        unsubscribeRef.current = subscribeReVisible(() => {
          fetchInstance.refresh();
        });
        return;
      }

      // 触发轮询
      timerRef.current = setTimeout(() => {
        // 如果一直触发 refresh() 就会一直重复这个过程不停的去回调请求
        fetchInstance.refresh();
      }, pollingInterval);
    },
    // 停止
    onCancel: () => {
      stopPolling();
    },
  };
};

export default usePollingPlugin;
