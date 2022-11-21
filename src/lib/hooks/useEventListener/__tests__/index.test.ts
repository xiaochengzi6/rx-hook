import { renderHook } from '@testing-library/react';

import useEventListener from ".."

describe('useEventListener', () => {
  it('should be defined', () => {
    expect(useEventListener).toBeDefined()
  })

  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('监听点击事件', async () => {
    let count = 0
    const onClick = () => {
      count++
    }
    const { rerender, unmount } = renderHook(() => {
      useEventListener('click', onClick, container)
    })

    document.body.click()

    expect(count).toEqual(0)

    container.click()

    expect(count).toEqual(1)

    rerender()

    container.click()

    expect(count).toEqual(2)

    unmount()

    container.click()

    expect(count).toEqual(2)

  })

  it('全局点击', async () => {
    let count = 0
    const onClick = () => {
      count++
    }

    renderHook(() => useEventListener('click', onClick))

    document.body.click()

    expect(count).toEqual(1)
    container.click()
    expect(count).toEqual(2)
  })

  let containerRef: object

  beforeEach(() => {
    containerRef = {
      current: container
    }
  })

  it('模拟 Ref', async () => {
    let count = 0
    const onClick = () => {
      count++
    }

    const { rerender, unmount } = renderHook(() => {
      useEventListener('click', onClick, containerRef)
    })

    document.body.click(); // 点击 document应该无效
    expect(count).toEqual(0);
    container.click(); // 点击 container count + 1
    expect(count).toEqual(1);
    rerender(); // 重新渲染
    container.click(); // 点击 container count + 1
    expect(count).toEqual(2);
    unmount(); // 卸载
    container.click(); // 点击 container 应该无效
    expect(count).toEqual(2);
  })

  it('没有绑定事件', async () => {
    let count = 0
    const onClick = () => {
      count++
    }

    const {result} = renderHook(() => {
      useEventListener('click', onClick, [])
    })

    document.body.click()
    expect(result).toBeUndefined()
  })
})