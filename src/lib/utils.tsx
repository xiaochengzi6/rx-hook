export const Waring = (value: any, message?: string) => {
  if(value === false || value === null || typeof value === 'undefined'){
    console.error(message)
  }
}

export const invariant = (value: any, message?: string) => {
  if(value === false || value === null || typeof value === 'undefined'){
    return new Error(message)
  }
}

export const isNumber = (val: unknown):val is number => typeof val === 'number'

const is = (x: any, y: any) => {
  if(x === y) {
    // +0 !== -0
    return x !== 0 || y !== 0 || 1/x === 1/y
  }
  // 判断 NAN 
  return x !== x && y !== y 
} 
