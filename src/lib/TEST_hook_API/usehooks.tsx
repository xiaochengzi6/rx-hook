import * as React from 'react';

export default function useHook_1(num: number) {
  const fnRef = React.useRef<() => void>();

  const stop = () => {
    fnRef.current?.();
  };

  React.useEffect(() => {
    if (num >= 1) {
      fnRef.current = () => {
        console.log(2);
      };
    }
    console.log('useHook 开始')
    return () => {
      console.log('组件卸载 useHook_1');
      stop();
    };
  }, [num]);

  return {
    stop,
  };
}
