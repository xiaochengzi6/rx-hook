import { isFunction } from '../../utils';
import type { MutableRefObject } from 'react';
import type { FetchState, Options, PluginReturn, Service, Subscribe } from './types';

export default class Fetch<TData, TParams extends any[]> {
  // 插件执行后返回的方法列表
  pluginImpls: PluginReturn<TData, TParams>[];

  count: number = 0;

  // 存储的状态, 重要的返回值
  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,

    public options: Options<TData, TParams>,
    // 订阅-更新函数
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>> = {},
  ) {
    this.state = {
      ...this.state,
      // 手动的触发 options.manual = true ==> loading = false 
      // 在使用的时候一开始就会进入 loading 加载状态 加载完成就通过 loading 来显示数据
      loading: !options.manual,
      // 初始值
      ...initState,
    };
  }

  // 更新值
  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    // 手动触发组件更新
    this.subscribe();
  }

  // 执行特定阶段插件方法
  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    // @ts-ignore
    // 执行 plugins 中数组返回真值
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }

  async runAsync(...params: TParams): Promise<TData> {
    this.count += 1;
    const currentCount = this.count;
    
    // 在请求前 'onBefore' 执行 plugins 
    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler('onBefore', params);

    // stop request
    // 如果上一个 stopNow 还未结束就返回一个待定的 promise 
    if (stopNow) {
      return new Promise(() => {});
    }

    // 重新设置值
    this.setState({
      loading: true,
      params,
      // onBefore 阶段返回的 state 可以影响到这里的 loading 
      // 比如: useLoadingDelayPlugin
      ...state,
    });

    // return now
    // returnNow == true 说明已经有值
    if (returnNow) {
      return Promise.resolve(state.data);
    }

    // =============== onBefore ==============

    // 如果存在 onBefore 函数，就要去调用
    this.options.onBefore?.(params);

    try {
      // =============== onRequest ==============
      // replace service
      let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params);

      // 
      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      // 等待 res : promise 返回值
      const res = await servicePromise;

      // 如果当前 count 和 currentCount 不相同就说明取消了这次的请求
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      // const formattedResult = this.options.formatResultRef.current ? this.options.formatResultRef.current(res) : res;

      // 请求开始时候就要设置 loading = true 
      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      // =============== onSuccess ==============
      // 请求c成功_1
      this.options.onSuccess?.(res, params);
      this.runPluginHandler('onSuccess', res, params);
      
      // =============== onFinally ==============
      // 请求完成_1
      this.options.onFinally?.(params, res, undefined);

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, res, undefined);
      }

      return res;
    } catch (error) {
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      this.setState({
        error,
        loading: false,
      });

      this.options.onError?.(error, params);
      // =============== onError ==============
      // 请求失败触发_2
      this.runPluginHandler('onError', error, params);

      this.options.onFinally?.(params, undefined, error);

      // =============== onFinally ==============
      // 请求完成触发_2
      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, undefined, error);
      }

      throw error;
    }
  }

  // 开始请求, 使用的是最新的 params 
  run(...params: TParams) {
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  // === 用于忽略当前 promise 返回的数据和错误 ===
  // 1. 组件卸载时正在执行 promise 取消
  // 2. promise 竞态取消
  // @see https://ahooks.js.org/zh-CN/hooks/use-request/basic

  // 取消 使 count + 1 记录请求次数
  cancel() {
    this.count += 1;
    this.setState({
      loading: false,
    });

    // 执行 Plugin
    this.runPluginHandler('onCancel');
  }

  // === refreshAsync && refresh 使我们可以使用上一次的参数，重新发起请求 ===

  //  使用上一次的 params，重新调用 run
  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || []));
  }

  // 使用上一次的 params，重新调用 runAsync
  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || []));
  }
  
  // === mutate, 支持立即修改 useRequest 返回的 data 参数。===

  // 修改 data。参数可以为函数，也可以是一个值
  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    let targetData: TData | undefined;
    if (isFunction(data)) {
      // @ts-ignore
      targetData = data(this.state.data);
    } else {
      targetData = data;
    }

    this.runPluginHandler('onMutate', targetData);

    this.setState({
      data: targetData,
    });
  }
}
