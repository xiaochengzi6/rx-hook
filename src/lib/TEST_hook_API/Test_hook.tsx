import { useEffect } from "react";
import useRunHook from "./useRunHook";

export default function TestHook() {
  const [setNum] = useRunHook()

  useEffect(()=>{
    console.log('Effect: 开始')
    return() => {
      console.log('Effect: 结束')
    }
  })
  return (
    <div>
      <button onClick={() => { }}>点击触发</button>
    </div>
  );
}
