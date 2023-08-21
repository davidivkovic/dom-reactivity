import { signal } from "dom-reactivity"

const notifier = signal()

export default function cookies () {

  const get = name => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
  
    if (cookie) {
      const [_, value] = cookie.split('=')
      return { value }
    }
  }

  const set = (name, value) => {
    document.cookie = `${name}=${value}; path=/`
    notifier(document.cookie + new Date().getTime())
  }

  notifier()

  return { get , set }
}