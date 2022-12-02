import { renderHook } from '@testing-library/react-hooks';
import useScriptDom from '.';

const setUp = (src: string) => renderHook(() => useScriptDom(src))


describe('useScriptDom', () => {
  it('should be worker', () => {

  })
})