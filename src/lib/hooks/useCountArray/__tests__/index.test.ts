import { renderHook, act } from "@testing-library/react"
import useCountArray from "../useCountArray"

const setUp = (initialValue?: number[]) => renderHook(() => useCountArray(initialValue))

describe('useCountArray', () => {
  it('should be default', () => {
    expect(useCountArray).toBeDefined()
  })

  it('should be value', () => {
    const { result } = setUp()
    expect(result.current[0]).toEqual([])
  })

  it('should be initial', () => {
    const { result } = setUp([1, 2, 3])
    expect(result.current[0]).toEqual([1, 2, 3])
  })

  it('should be method', () => {
    const { result } = setUp()
    expect(result.current[1]).toStrictEqual({
      increase: expect.any(Function),
      decrease: expect.any(Function),
      del: expect.any(Function),
      clear: expect.any(Function)
    })

    act(()=>{
      result.current[1].increase()
    })
    expect(result.current[0]).toEqual([1])

    act(() => {
      result.current[1].increase()
    })
    expect(result.current[0]).toEqual([1,2])

    act(()=>{
      result.current[1].decrease()
    })
    expect(result.current[0]).toEqual([1])

    act(()=>{
      result.current[1].decrease()
    })
    expect(result.current[0]).toEqual([])

    
  })
})