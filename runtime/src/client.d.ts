import type { JSX } from "../../dom-expressions/src/jsx.d.ts"
export type * from "../../dom-expressions/src/client.d.ts"

/* Runtime type declarations */

type Effect = object
type Getter<T> = () => T
type Setter<T> = (v: T | ((prev?: T) => T)) => void
type Signal<T> = Getter<T> & Setter<T>
type PreloadedData<T> = () => T | (() => T)
type Component<T> = (props: T) => JSX.Element

type ResourceResult<T> = [
  {
    (): Signal<T | undefined>
    state: "unresolved" | "pending" | "ready" | "refreshing" | "errored"
    loading: boolean
    error: any
  },
  {
    mutate: (v: T | undefined) => void
    refetch: () => T | Promise<T>
  }
]

type ResourceOptions<T> = {
  initialValue?: T
  preloaded?: PreloadedData<T>
}

type ResourceFetcher<T, U> = (
  k: U,
  info: { value: T | undefined, refetching: boolean | unknown }
) => T | Promise<T>

export function signal<T>(value: T): Signal<T>
export function effect<T>(fn: (v: T) => T, value?: T): void
export function memo<T>(fn: (v: T) => T, value?: T): Signal<T>

export function resource<T, U = true>(
  fetcher: ResourceFetcher<T, U>,
  options?: ResourceOptions<T>
): ResourceResult<T>

export function resource<T, U>(
  source: false | null | Signal<U> | (() => U | false | null),
  fetcher: ResourceFetcher<T, U>,
  options?: ResourceOptions<T>
): ResourceResult<T>

export function onMount(fn: () => void): void
export function onDispose(fn: () => void): void

export function untrack<T>(fn: () => T): T

export function batch<T>(fn: () => T): T

export function selector<T, U>(
  source: () => T,
  fn?: (a: U, b: T) => boolean
): (key: U) => boolean

export function getOwner(): Effect
export function runWithOwner(owner: Effect, fn: () => void): void

export function root<T>(fn: (dispose: () => void) => T): T

export function createComponent<T>(Component: Component<T>, props: T): JSX.Element

export function lazy<P, T extends Component<P>>(
  fn: () => Promise<{ default: T }>
): (props: P) => Signal<T> & { preload: () => Promise<T> }

export function mergeProps(...sources: any): any


/* Router type declarations */

type DataFunction<T> = (
  { params, queryParams, preloaded } : 
  {
    params: Params
    queryParams: Params
    preloaded: () => ({ [href: string]: { data: T } })
  }
) => T

type PageProps = {
  children?: JSX.Element
  data?: any
}

type Route<T extends Component<P>, P = PageProps> = {
  path: string
  component: T | ReturnType<typeof lazy<P, T>>
  data?: DataFunction<unknown>
  children?: Route<any>[]
  noStale?: boolean
}
type Params = Record<string, string | undefined>
type NavigationOptions = {
  skipNavigation?: boolean
  scroll?: boolean
  smooth?: boolean
}

export function usePathname(): Getter<string>
export function useParams(): Getter<Params>
export function useQuery(): Signal<Params>

export function navigateTo(route: string, options: NavigationOptions): void

export function Router(props: { routes: Route<any>[] }): Signal<JSX.Element>
export function Link(props:
  JSX.DOMAttributes<HTMLAnchorElement> &
  NavigationOptions &
  {
    exact?: boolean
    activeClass?: string
    inactiveClass?: string
  }
): HTMLAnchorElement