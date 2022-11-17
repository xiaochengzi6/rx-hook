// from swr
import canUseDom from '../../../utils/canUseDom';
import isDocumentVisible from './isDocumentVisible';
import isOnline from './isOnline';

const listeners: any[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

if (canUseDom()) {
  const revalidate = () => {
    // 页面隐藏 或者聚焦就直接返回
    if (!isDocumentVisible() || !isOnline()) return;
    // 触发监听函数
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };
  // 页面隐藏 
  window.addEventListener('visibilitychange', revalidate, false);
  // 页面聚焦发生变化 
  window.addEventListener('focus', revalidate, false);
}

export default subscribe;
