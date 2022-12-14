import { useEffect } from "react";
import useScriptDom from "./lib/hooks/useScriptDom";

function App() {
  const [loading, error] = useScriptDom(
    '//www.google.com/js/bg/Cy76TGYNwlBdeFKzRh_Qc2a075RKB_J9dWAUlCdaUYI.js'
  )
  useEffect(() => {
    console.log({loading})
  }, [loading])

  return (
    <div style={{ width: 400, margin: '0 auto' }} >
      <div></div>
    </div>
  );
}

export default App;
