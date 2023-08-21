import { resource } from "../../src/reactivity"

export default function FetchDemo() {
  const [data] = resource(() => fetch('https://jsonplaceholder.typicode.com/todos/3').then(r => r.json()))
  return <div>
    <h1>Fetch Demo</h1>
    <if condition={!data.loading} fallback={<div>Loading...</div>}>
      <div>{data().title}</div>
    </if>
  </div>
}