import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect';
import type { Plugin } from '../types';

// support refreshDeps & ready
// manual = true 手动请求模式，只要 ready 为 false不会请求
// manual = false 自动请求模式，ready false => true 自动请求
const useAutoRunPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { manual, ready = true, defaultParams = [], refreshDeps = [], refreshDepsAction },
) => {
  const hasAutoRun = useRef(false);
  hasAutoRun.current = false;

  // 在组件更新阶段调用 run 
  useUpdateEffect(() => {
    // 自动请求模式
    if (!manual && ready) {
      hasAutoRun.current = true;
      fetchInstance.run(...defaultParams);
    }
  }, [ready]);

  useUpdateEffect(() => {
    // 自动请求发出就会返回
    if (hasAutoRun.current) {
      return;
    }
    // 自动请求模式 
    if (!manual) {
      hasAutoRun.current = true;
      if (refreshDepsAction) {
        refreshDepsAction();
      } else {
        fetchInstance.refresh();
      }
    }
  }, [...refreshDeps]);

  return {
    onBefore: () => {
      // 只要是 false 都会停止请求
      if (!ready) {
        return {
          stopNow: true,
        };
      }
    },
  };
};

useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  // 自动模式 && ready = true 那么 loading = true 
  return {
    loading: !manual && ready,
  };
};

export default useAutoRunPlugin;
