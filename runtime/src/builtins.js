import { signal, effect, memo, untrack, mergeProps } from './reactivity'
import { mapArray } from './array'

const narrowedError = name => `Attempting to access a stale value from <${name}> that could possibly be undefined. This may occur because you are reading the accessor returned from the component at a time where it has already been unmounted. We recommend cleaning up any stale timers or async, or reading from the initial condition.`

function ConditionalComponent(props) {
  const condition = memo(() => props.condition)
  return memo(() => {
    const c = condition()
    if (!c) return props.fallback

    const children = props.children
    const fn = typeof children === "function" && children.length > 0

    return fn
      ? untrack(() => children(
        props.keyed
          ? (c)
          : () => {
            if (!untrack(condition)) throw narrowedError("If")
            return props.condition
          }
      ))
      : children
  })
}

export function If(props) {

  const condition = memo(() => props.condition)
  const component = ConditionalComponent(mergeProps(props, condition))

  // just return the component if there is no animation
  if (!props.enterClass && !props.exitClass) return component

  let nextNode = null
  const componentNode = signal(untrack(component))

  const endAnimation = e => {
    if (e.target) {
      e.target.removeEventListener("animationend", endAnimation)
      e.target.classList.remove(props.exitClass, props.enterClass)
    }

    if (e.target !== nextNode) {
      componentNode(nextNode)
    }
  }

  effect(() => {
    const currentNode = untrack(componentNode) // currently in the DOM
    nextNode = component() // needs to be inserted into the DOM

    if (Array.isArray(nextNode)) throw new Error("<if> must have exactly one child element.")
    if (currentNode === nextNode) return
    
    if (currentNode) {
      if (props.exitClass) {
        currentNode.classList.add(props.exitClass)
        currentNode.addEventListener("animationend", endAnimation)
      }
      else componentNode(nextNode)
    }

    if (nextNode) {
      if (props.enterClass) {
        nextNode.classList.add(props.enterClass)
        nextNode.addEventListener("animationend", endAnimation)
      }
      else componentNode(currentNode)
      if (!currentNode) componentNode(nextNode) // handle the case when the fallback (element) is undefined
    }
  })

  return componentNode
}

export function For(props) {
  return memo(mapArray(() => props.each, props.children, undefined))
}
