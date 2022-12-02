import { renderHook } from "@testing-library/react"
import { useUnMount } from "."

const setUp = (fn: () => void) => renderHook(() => useUnMount(fn))

describe('useUnMount', () => {
  it('should be work', () => {
    const mockFn = jest.fn()
    const hook = setUp(mockFn)
    expect(mockFn).toBeCalledTimes(0)
    hook.rerender()
    expect(mockFn).toBeCalledTimes(0)
    hook.unmount()
    expect(mockFn).toBeCalledTimes(0)
  })
})