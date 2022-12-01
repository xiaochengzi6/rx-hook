import useScriptDom from "./lib/hooks/useScriptDom";

function App() {
  const [loading, error] = useScriptDom('https://github.githubassets.com/assets/wp-runtime-80947ef5386.js')

  return (
    <div style={{ width: 400, margin: '0 auto' }} >
      <div></div>
    </div>
  );
}

export default App;
