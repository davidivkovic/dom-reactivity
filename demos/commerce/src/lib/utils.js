import { signal } from 'dom-reactivity'

export const createUrl = (pathname, params) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`

  return `${pathname}${queryString}`
}

export const transition = () => {
  const pending = signal(false)
  const start = fn => {
    if (!fn) throw new Error('transition must be called with a function')

    pending(true)
    const promise = fn()
    
    if (!promise || typeof promise.then !== 'function') {
      throw new Error('transition must return a promise')
    }

    promise.then(() => pending(false)).catch(() => pending(false))
  }
  return [pending, start]
}