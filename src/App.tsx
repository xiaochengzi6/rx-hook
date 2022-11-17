import TestHook from "./lib/TEST_hook_API/Test_hook";
import TestCountArray from "./TestCountArray";
function App() {
  return (
    <div 
    style={{width: 400, margin: '0 auto'}}
     >
      <h1>React Hook</h1>

      <span>测试 UseCountArray </span>
      <TestCountArray />

      <div>
        <span> 测试 hook </span>
        <TestHook></TestHook>
      </div>


    </div>
  );
}

export default App;
