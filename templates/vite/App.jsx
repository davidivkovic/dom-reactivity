import { effect, signal } from "dom-reactivity"

import javascriptLogo from "/javascript.svg"
import viteLogo from "/vite.svg"

const counter = signal(0)
const increment = () => counter(c => c + 1)

setInterval(increment, 1000)

export default function App() {

  effect(() => console.log("The current value of the counter is: ", counter()))

  const el = document.createElement('p')
  el.innerHTML = "This is a native DOM element, created with <code>document.createElement()</code>"

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} class="logo" alt="Vite logo" />
      </a>
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        target="_blank"
      >
        <img src={javascriptLogo} class="logo vanilla" alt="JavaScript logo" />
      </a>
      <h1>Hello dom-reactivity!</h1>
      <div class="card">
        <button id="counter" type="button" onClick={increment}>
          Click me! {counter()}
        </button>
      </div>
      {el}
    </div>
  )
}
