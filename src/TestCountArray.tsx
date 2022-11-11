import { useEffect } from 'react'
import {useCountArray} from './lib/index'


export default function TestCountArray () {
  const [countArray, actions] = useCountArray()
  const {increase, decrease, del, clear} = actions

  useEffect(()=>{
    console.log('countArray', countArray)
  },[countArray])
  return (
    <div>
      <button onClick={() => increase()}>increase</button>
      <button onClick={() => decrease()}>decrease</button>
      <button onClick={() => del(1)}>删除索引 1 </button>
      <button onClick={() => clear()}>清空</button>
    </div>
  )
}