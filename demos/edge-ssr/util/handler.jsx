import App from "../src/app"
import { renderToString } from "dom-reactivity/ssr"

let isCold = true

export default function Handler(req) {
  const wasCold = isCold
  let html
  isCold = false

  try {
    html = renderToString(() => <App req={req} isCold={wasCold} />)
  } catch (err) {
    console.error("Render error:", err.stack)
    return new Response(
      `<!doctype html><h1>Internal application error</h1>
      <p>The app failed to render. Check your Edge Function logs.</p>`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    )
  }

  return new Response(`<!doctype html>` + html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "x-is-cold": wasCold ? "true" : "false",
    },
  })
}
