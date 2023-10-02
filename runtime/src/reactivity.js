let time = 0
const effects = {
  tracked: [],
  untracked: []
}
const batching = {
  active: false,
  queue: new Set(),
}

function getCurrentEffect(options = { allowUntracked: false }) {
  const tracked = () => effects.tracked[effects.tracked.length - 1]
  const untracked = () => effects.untracked[effects.untracked.length - 1]

  if (options.allowUntracked) return tracked() ?? untracked()
  return tracked()
}

function subscribe(effect, subscribers, subscriptionTimes) {
  subscribers.add(effect)
  subscriptionTimes.set(effect, ++time)
  effect.references.add({ subscribers, subscriptionTimes })
}

function cleanup(effect) {

  function removeReferences(effect) {
    for (const reference of effect.references) {
      reference.subscribers.delete(effect)
      reference.subscriptionTimes.delete(effect)
    }
    effect.references.clear()
  }

  function runDisposers(effect) {
    for (const disposer of effect.disposers) {
      disposer()
    }
    effect.disposers.clear()
  }

  for (const owned of effect.owned) {
    cleanup(owned)
  }

  effect.owned.clear()

  runDisposers(effect)
  removeReferences(effect)
}

export function signal(value) {

  const subscribers = new Set()
  const subscriptionTimes = new Map()

  function read() {
    const effect = getCurrentEffect()
    effect && subscribe(effect, subscribers, subscriptionTimes)
    return value
  }

  function write(nextValue) {
    if (value === nextValue) return
    value = nextValue

    const currentTime = time
    for (const subscriber of subscribers) {
      if (subscriptionTimes.get(subscriber) > currentTime) continue
      if (batching.active) {
        batching.queue.add(subscriber)
      }
      else {
        subscriber.execute()
      }
    }
  }

  return function (nextValue) {
    if (!arguments.length) return read()
    if (typeof nextValue === 'function') {
      nextValue = nextValue(value)
    }
    write(nextValue)
  }
}

export function effect(fn, value) {

  const effect = {
    owned: new Set(),
    references: new Set(),
    disposers: new Set(),
    execute() {
      cleanup(effect)
      effects.tracked.push(effect)
      try {
        value = fn(value)
      } finally {
        effects.tracked.pop()
      }
    }
  }

  const currentEffect = getCurrentEffect({ allowUntracked: true })

  if (currentEffect) {
    currentEffect.owned.add(effect)
  }
  else {
    console.warn("computations created outside a `root` or `render` will never be disposed")
  }

  effect.execute()

}

export function memo(fn, value) {
  const current = signal(value)
  effect(() => current(c => fn(c)), value)
  return current
}

export function onDispose(fn) {
  const currentEffect = getCurrentEffect({ allowUntracked: true })
  if (currentEffect) {
    currentEffect.disposers.add(fn)
  }
  else {
    console.warn("disposers created outside a `root` or `render` will never be run")
  }
}

export function onMount(fn) {
  effect(() => untrack(fn))
}

export function untrack(fn) {
  if (effects.tracked.length === 0) return fn()
  const temp = effects.untracked
  effects.untracked = effects.tracked
  effects.tracked = []
  try {
    return fn()
  } finally {
    effects.tracked = effects.untracked
    effects.untracked = temp
  }
}

export function batch(fn) {
  if (batching.active) return fn()
  batching.active = true
  try {
    return fn()
  } finally {
    batching.active = false
    for (const effect of batching.queue) {
      effect.execute()
    }
    batching.queue.clear()
  }
}

export function selector(source, fn = (k, v) => k === v) {

  const subscriberMap = new Map()
  const subscriptionTimes = new Map()

  effect(previous => {
    const value = source()
    const currentTime = time

    for (const [key, subscribers] of subscriberMap.entries()) {
      if (subscriptionTimes.get(key) > currentTime) continue
      if (fn(key, value) !== fn(key, previous)) {
        for (const effect of subscribers) {
          if (batching.active) {
            batching.queue.add(effect)
          }
          else {
            effect.execute()
          }
        }
      }
    }

    return value
  })

  return function (key) {
    const currentEffect = getCurrentEffect()

    if (currentEffect) {
      const subscribers = subscriberMap.get(key) ?? new Set()
      subscribers.add(currentEffect)
      subscriberMap.set(key, subscribers)
      subscriptionTimes.set(key, ++time)

      onDispose(() => {
        subscribers.delete(currentEffect)
        if(subscribers.size == 0) {
          subscriberMap.delete(key)
          subscriptionTimes.delete(key)
        }
      })
    }

    return fn(key, untrack(source))
  }

}

export function getOwner() {
  return getCurrentEffect({ allowUntracked: true })
}

export function runWithOwner(owner, fn) {
  try {
    owner && effects.tracked.push(owner)
    return fn()
  }
  finally {
    owner && effects.tracked.pop()
  }
}

export function root(fn, detachedOwner) {

  const owner = getOwner()
  const unowned = fn.length === 0

  const root = unowned ? {} : {
    debugName: 'Root',
    owned: new Set(),
    references: new Set(),
    disposers: new Set(),
    execute() {
      console.debug('Creating Root')
    }
  }

  const updateFn = unowned ? fn : () => fn(() => untrack(() => cleanup(root)))

  effects.tracked.push(root)
  try {
    return updateFn()
  }
  finally {
    effects.tracked.pop()
  }
}

export function resource(source, fetcher, options = {}) {
  if ((arguments.length === 2 && typeof fetcher === "object") || arguments.length === 1) {
    options = fetcher || {}
    fetcher = source
    source = true
  }

  if (typeof fetcher !== "function") throw new Error("fetcher must be a function")

  const value = signal(options.initialValue)
  const state = signal("initialValue" in options ? "ready" : "unresolved")
  const error = signal()
  const dynamic = typeof source === "function" && memo(() => source())

  function load(refetching = false) {
    /* Track on every cycle, in order to not dispose the dynamic source  
    if the condition below is true and short circuits the effect */
    const tracked = dynamic && dynamic()
    const s = untrack(state)

    if (s === "pending" || s === "refreshing") return

    if (options.preloaded) {
      const data = options.preloaded()
      if (data) {
        const v = typeof data === "function" ? untrack(data) : data
        if (v !== undefined) {
          value(v)
          state("ready")
          return
        }
      }
    }

    state(refetching ? "refreshing" : "pending")
    error(undefined)

    const fetcherResult = fetcher(
      dynamic ? tracked : true, 
      { 
        value: untrack(value), 
        refetching 
      }
    )

    const isPromise = fetcherResult?.then

    if (!isPromise) {
      value(fetcherResult)
      state("ready")
      return fetcherResult
    }

    return fetcherResult.then(
      v => {
        value(v)
        state("ready")
      },
      e => {
        error(e)
        state("errored")
      }
    )
  }

  function read() {
    return value()
  }

  Object.defineProperties(read, {
    loading: {
      get() {
        const s = state()
        return s === "pending" || s === "refreshing"
      }
    },
    error: { get: () => error() },
    state: { get: () => state() }
  })

  if (dynamic) effect(() => load())
  else load()

  return [read, { refetch: () => load(true), mutate: (v) => value(v) }]
}

export function createComponent(Component, props) {
  return untrack(() => Component(props || {}))
}

export function lazy(fn) {
  let comp
  let prom
  const wrap = props => {
    const [s] = resource(() => prom || (prom = fn()))
    comp = () => s()?.default
    let Comp
    return memo(() => (Comp = comp()) && createComponent(Comp, props))
  }
  wrap.preload = () => prom || ((prom = fn()).then(mod => (comp = () => mod.default)), prom)
  return wrap
}

function resolveSource(s) {
  return (s = typeof s === "function" ? s() : s) == null ? {} : s
}

export function mergeProps(...sources) {
  return new Proxy(
    {
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property]
          if (v !== undefined) return v
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i])) return true
        }
        return false
      },
      keys() {
        const keys = []
        for (let i = 0; i < sources.length; i++) {
          keys.push(...Object.keys(resolveSource(sources[i])))
        }
        return [...new Set(keys)]
      }
    },
    propTraps
  )
}

const propTraps = {
  get(target, property) {
    return target.get(property)
  },
  has(target, property) {
    return target.has(property)
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(target, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return target.get(property)
      },
      set: trueFn,
      deleteProperty: trueFn
    }
  },
  ownKeys(target) {
    return target.keys()
  }
}

function trueFn() {
  return true
}