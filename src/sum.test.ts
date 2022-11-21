import {sum} from './sum'

const data = (count?: number) => {
  if(typeof count == 'number'){
    return count 
  }
  return undefined
}

describe('sum', ()=>{
  it('求和： 1 + 2 = 3', () => {
    expect(sum(1, 2)).toEqual(3)
  })

  it('toBeTruthy:', () => {
    expect(data(4)).toBeTruthy()
  })

  it('toBeFalsy', ()=>{
    expect(data()).toBeFalsy()
  })
})

