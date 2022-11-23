import { renderHook, act } from '@testing-library/react';
import useMap from "../useMap"

const setUp = (initialValue?: Iterable<readonly [any, any]>) => renderHook(() => useMap(initialValue))

describe('React Hook useMap', () => {
  it('should be default', () => {
    expect(useMap).toBeDefined()
  })

  it('should be actions', () => {
    const {result}= setUp([
      ['key', 'value'],
      ['a', 1]
    ])
    const [map, actions] = result.current
    expect([...map]).toEqual([
      ['key', 'value'],
      ['a', 1]
    ])

    expect(actions).toStrictEqual({
      set: expect.any(Function),
      setAll: expect.any(Function),
      remove: expect.any(Function),
      reset: expect.any(Function),
      get: expect.any(Function)
    })
  })

  it('should be actions', () => {
    const {result} = setUp([
      ['key', 'value'],
      ['a', 1]
    ])

    act(() => {
      result.current[1].set('a', 'wwww')
    })

    expect([...result.current[0]]).toEqual([
      ['key', 'value'],
      ['a', 'wwww']
    ])

    act(() => {
      result.current[1].set('newKey', 'newValue')
    })
    expect([...result.current[0]]).toEqual([
      ['key', 'value'],
      ['a', 'wwww'],
      ['newKey', 'newValue']
    ])

    act(() => {
      result.current[1].setAll([
        ['foo', 'foo'],
        ['bar', 'bar']
      ])
    })
    expect([...result.current[0]]).toEqual([
      ['foo', 'foo'],
      ['bar', 'bar']
    ])

    act(() => {
      result.current[0].clear()
    })
    expect([...result.current[0]]).toEqual([])

    act(() => {
      result.current[1].reset()
    })
    expect([...result.current[0]]).toEqual([
      ['key', 'value'],
      ['a', 1]
    ])

    expect(result.current[1].get('a')).toEqual(1)

    act(() => {
      result.current[1].remove('key')
    })
    expect([...result.current[0]]).toEqual([['a', 1]])
  })

  it('should be reset', () => {
    const {result} = setUp()
    act(()=> {
      result.current[1].reset()
    })
    expect([...result.current[0]]).toEqual([])
  })
  
})