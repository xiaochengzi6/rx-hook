import { useState } from "react"

interface Actions {
  add: (num?: number) => void;
  dec: (num?: number) => void;
  set: (num?: number) => void;
}

function useCount(initialValue = 0): [number, Actions] {
  const [current, setCurrent] = useState(initialValue)

  const add = (num = 1) => setCurrent((prevState) => prevState + num)

  const dec = (num = 1) => setCurrent((prevState) => prevState - num)

  const set = (num = 1) => setCurrent(num)

  return [
    current,
    {
      add,
      dec,
      set
    }
  ]

}

export default useCount 