import { useCallback, useState } from "react";

// 使其更新 
function useUpdate() {
  const [_, setValue] = useState({})
  return useCallback(() => setValue({}), [])
}

export default useUpdate