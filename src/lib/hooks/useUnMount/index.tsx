import { useEffect } from "react";

export function useUnMount(fn: () => void) {
  useEffect(
    () => () => {
      fn()
    },
    []
  )
}