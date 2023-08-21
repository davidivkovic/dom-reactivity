
import {
  signal,
  memo,
  onDispose, 
  untrack, 
  mergeProps, 
  createComponent, 
  spread, 
  insert,
  template,
  getOwner,
  runWithOwner,
  batch
} from './client'

const currentRoute = signal(getCurrentRoute())
const params = signal({})
const queryParams = signal({})
let routes = []

function queryToObject(query) {
  return Object.fromEntries(new URLSearchParams(query ?? ''))
}

function getCurrentRoute() {
  return location.href.replace(location.origin, '')
}

function handleRouteChange() {
  currentRoute(getCurrentRoute())
}

function convertRoutes(routes, parentPath = ''/* 2 because of the leading '/' */) {
  routes.sort((a, b) => b.path.length - a.path.length)

  return routes.map((route) => {
    if (!route.path.startsWith('/')) throw new Error('Route must start with a \'/\'')

    const newPath = (parentPath + route.path).replace('//', '/')
    const modifiedRoute = { ...route, depth: newPath.split('/').length, path: newPath }

    if (route.children) {
      modifiedRoute.children = convertRoutes(route.children, newPath)
    }

    return modifiedRoute
  })
}

function matchRoute(currentRoute, route) {

  const pathParams = {}
  const [cr, currentQuery] = currentRoute.split('?')
  const [r] = route.split('?')

  const currentRouteParts = cr.split('/')
  const routeParts = r.split('/')

  if (routeParts[1] === '') {
    return { pathParams, query: currentQuery, depth: currentRouteParts.length }
  }

  if (routeParts.length > currentRouteParts.length) {
    return null
  }

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i]
    const currentRoutePart = currentRouteParts[i]

    if (routePart.startsWith(':')) {
      const paramName = routePart.slice(1)
      pathParams[paramName] = currentRoutePart
    }
    else if (routePart !== currentRoutePart) {
      return null
    }
  }

  return { pathParams, query: currentQuery, depth: currentRouteParts.length }
}

function renderRoutes(routes) {
  const notFoundRoute = routes.find(r => r.path == '/*')

  const state = memo(previous => {
    const currentPath = currentRoute()

    for (const route of routes) {
      const match = matchRoute(currentPath, route.path)
      if (match) {
        if (match.depth == route.depth && route.path !== '/') { // TODO: Idk how to fix this
          batch(() => {
            params(match.pathParams)
            queryParams(queryToObject(match.query))
          })
        }
        const result = { route, match }
        return previous?.route?.path === result?.route?.path ? previous : result
      }
    }

    if (notFoundRoute) {
      return { component: notFoundRoute.component }
    }
  })

  return memo(() => {
    const s = state()
    if (!s) return

    const { component: Component, children } = s.route
    if (!Component) throw new Error('No component found for route: ' + untrack(currentRoute))

    const hasChildren = children && Object.keys(children).length > 0
    const childComponent = hasChildren && renderRoutes(children)

    const props = { children: childComponent }
    const r = s.route

    if (r.data) {
      props.data = r.data({ 
        params, 
        queryParams,
        preloaded: () => {
          const href = untrack(currentRoute)
          try { return r.preloaded?.[href]?.data }
          finally { r.noStale && delete r.preloaded?.[href] }
        }
      })
    }

    return createComponent(Component, props)
  })
}

export function usePathname() {
  return () => currentRoute().split('?')[0]
}

export function useParams() {
  return () => params()
}

export function useQuery() {
  return function (v) {
    if (arguments.length === 0) return queryParams()
    queryParams(v)
    const [route] = currentRoute().split('?')
    const newQuery = new URLSearchParams(queryParams()).toString()
    navigateTo(route + (newQuery ? '?' + newQuery : ''), { skipNavigation: true })
  }
}

export function navigateTo(route, { skipNavigation = false, scroll = false, smooth = false } = {}) {
  if (route === currentRoute()) return
  window.history.pushState(null, '', route)
  !skipNavigation && currentRoute(route)
  if (untrack(currentRoute) === '/') {
    params({})
    queryParams({})
  }
  scroll && window.scrollTo({ top: 0, left: 0, behavior: smooth ? 'smooth' : 'instant' })
}

export function Router(props) {
  routes = convertRoutes(props.routes)

  window.addEventListener('popstate', handleRouteChange)
  onDispose(() => window.removeEventListener('popstate', handleRouteChange))

  return renderRoutes(routes)
}

export function Link(props) {

  const owner = getOwner()

  const isActive = memo(() => {
    const [route] = currentRoute().split('?')
    return props.exact ? route === props.href : route.startsWith(props.href)
  })

  function onClick(e) {
    if (e.target.closest('a').origin !== window.location.origin) return
    const { href, skipNavigation = false, scroll = true, smooth = false } = props

    e.preventDefault()
    navigateTo(href, { skipNavigation, scroll, smooth })
    props.onClick?.(e)
  }

  function preloadRoute(route, href, match) {
    if (route.data) {
      route.preloaded ??= {}
      route.preloaded[href] ??= {
        data: route.data({ 
          params: () => match.pathParams ?? {},
          queryParams: () => queryToObject(match.query),
          preloaded: () => {}
        })
      }
    }
  }

  function preloadRoutes (routes) {
    for (const route of routes) {
      const match = matchRoute(props.href, route.path)
      if (!match) continue
      route.component.preload?.()
      runWithOwner(owner, () => preloadRoute(route, props.href, match))
      route.children && preloadRoutes(route.children)
    }
  }

  const onMouseOver = e => {
    preloadRoutes(routes)
    props.onMouseOver?.(e)
  }

  const t = /*#__PURE__*/template(`<a>`)
  const element = t()

  spread(element, mergeProps(props, {
    get classList() {
      return {
        ...(props.class && {
          [props.class]: true
        }),
        [props.inactiveClass]: !isActive(),
        [props.activeClass]: isActive(),
        ...props.classList
      }
    },
    onClick,
    onMouseOver
  }), false, true)

  insert(element, () => props.children)
  return element
}