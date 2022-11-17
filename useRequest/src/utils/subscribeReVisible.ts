import canUseDom from '../../../utils/canUseDom';
import isDocumentVisible from './isDocumentVisible';

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
    // 查看页面是否隐藏
    if (!isDocumentVisible()) return;
    // 触发订阅的监听函数
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };
  // 浏览器标签页被隐藏或显示的时候会触发visibilitychange事件
  window.addEventListener('visibilitychange', revalidate, false);
}

export default subscribe;
