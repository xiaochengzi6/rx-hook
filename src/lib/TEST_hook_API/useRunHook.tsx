import * as React from 'react';
import useHook_1 from './usehooks';

export default function useRunHook(): any {
  const [num, setNum] = React.useState(0);
  const att = [useHook_1];

  const a = att.map((hook: any) => {
    return hook(num)
  });

  React.useEffect(()=>{
    console.log('打印 hook 的状态', a)
  })

  return [setNum]
  // return (
  //   <div>
  //     <p>{num}--:)</p>
  //     <button onClick={() => setNum((num) => num + 1)}>增加num</button>
  //     <button onClick={() => StartHook()}>触发 hook</button>
  //   </div>
  // );
}
