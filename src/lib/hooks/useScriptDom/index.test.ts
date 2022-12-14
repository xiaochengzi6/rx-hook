import { renderHook, act } from '@testing-library/react-hooks';
import useScriptDom, {Options} from '.';

const setUp = (src: string, options?: Options) => renderHook(() => useScriptDom(src, options))


describe('useScriptDom', () => {
  beforeEach(() => {
    const html = document.querySelector('html')
    if(html){
      html.innerHTML = ''
    }
  })

  it('should be defined', () => {
    expect(useScriptDom).toBeDefined()
  })

  it('should be append script label', async() => {
    const api = 'https://github.githubassets.com/assets/wp-runtime-80947ef53862.js'
    let hook: any;
    // const {result} = setUp(api)
    await act( async() => {
      hook = setUp(api)
    })
    const [loading, error] = hook.result.current

    // expect(loading).toEqual(true)
    expect(error).toBeNull()

    const script = document.querySelector('script') as HTMLScriptElement

    expect(script).not.toBeNull()

    expect(script.getAttribute('src')).toEqual(api)
  })
})