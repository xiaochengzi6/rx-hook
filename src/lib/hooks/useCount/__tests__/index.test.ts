import { renderHook, act } from '@testing-library/react';
import useCount from '../useCount';

describe("TEST useCount:", () => {
  it ('数字增加：', async () => {
    const { result } = renderHook(() => useCount(7))
    expect(result.current[0]).toEqual(7)

    act(() => { result.current[1].add() })

    expect(result.current[0]).toEqual(8)
  })
})