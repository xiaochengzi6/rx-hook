import useMap from "..";

export default function () {
  const[map, {set, setAll, get, reset, remove}] = useMap<string|number, string>([
    ['foo', 'value_foo'],
    ['bar', 'value_bar'],
    [222, 'value_number_1']
  ])

  return (
    <div>
      <span>{map.get('foo')}</span>
      <span>{get('bar')}</span>
    </div>
  )
}