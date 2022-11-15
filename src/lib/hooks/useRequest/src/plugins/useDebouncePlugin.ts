import type { DebouncedFunc, DebounceSettings } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';
import type { Plugin } from '../types';

const useDebouncePlugin: Plugin<any, any[]> = (
  fetchInstance,
  { debounceWait, debounceLeading, debounceTrailing, debounceMaxWait },
) => {
  const debouncedRef = useRef<DebouncedFunc<any>>();
  
  // 更新 options 
  const options = useMemo(() => {
    const ret: DebounceSettings = {};
    if (debounceLeading !== undefined) {
      ret.leading = debounceLeading;
    }
    if (debounceTrailing !== undefined) {
      ret.trailing = debounceTrailing;
    }
    if (debounceMaxWait !== undefined) {
      ret.maxWait = debounceMaxWait;
    }
    return ret;
  }, [debounceLeading, debounceTrailing, debounceMaxWait]);

  useEffect(() => {
    // options.debounceWait != false 就进入到了防抖模式
    if (debounceWait) {
      // 这里拿到了之前的 runAsync 函数
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

      // 存储 debounce 防抖函数，
      debouncedRef.current = debounce(
        (callback) => {
          callback();
        },
        debounceWait,
        options,
      );

      // debounce runAsync should be promise
      // https://github.com/lodash/lodash/issues/4400#issuecomment-834800398
      // 去替换 runAsync
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          // 调用 debounce 开始监听事件
          debouncedRef.current?.(() => {
            // 触发更新, 在这里会进行防抖
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject);
          });
        });
      };

      return () => {
        debouncedRef.current?.cancel();
        // 让 runAsync 恢复
        fetchInstance.runAsync = _originRunAsync;
      };
    }
  }, [debounceWait, options]);

  // debounceWait 没有就直接返回
  if (!debounceWait) {
    return {};
  }

  // 返回取消 OnCancel 函数
  return {
    onCancel: () => {
      debouncedRef.current?.cancel();
    },
  };
};

export default useDebouncePlugin;

/**
 * 总体的流程就是 你去使用防抖函数，进行防抖 然后再这里会去开启防抖，也就是会替换 runAsync 函数
 * 这个函数在 run() 方法中，而这个 run 是我们调用去触发的防抖函数，但其原来的 runAsync 会保存
 * 下来不改变还是原来的流程
 */