import { createUrl } from 'lib/utils'
import config from 'lib/config'
import { Link, effect, usePathname, useQuery } from 'dom-reactivity'

const pathname = usePathname()
const query = useQuery()
const { SITE_NAME } = config

function PathFilterItem(props) {

  const newParams = new URLSearchParams(query())
  const active = () => pathname() == props.item.path
  
  newParams.delete('q')
  
  effect(() => active() && (document.title =`${props.item.title} | ${SITE_NAME}`))

  return (
    <li class="flex text-black dark:text-white">
      <if
        condition={!active()}
        fallback={
          <p class="py-1 w-full text-sm hover:underline dark:hover:text-neutral-100 underline underline-offset-4 cursor-pointer">
            {props.item.title}
          </p>
        }
      >
        <Link
          href={createUrl(props.item.path, newParams)}
          class="py-1 w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100"
        >
          {props.item.title}
        </Link>
      </if>
    </li>
  )
}

function SortFilterItem(props) {

  const active = () => query().sort == props.item.slug
  const q = () => query().q

  const href = () => createUrl(
    pathname(),
    new URLSearchParams({
      ...(q() && { q: q() }),
      ...(props.item.slug && props.item.slug.length && { sort: props.item.slug })
    })
  )

  return (
    <li class="flex text-sm text-black dark:text-white">
      <if
        condition={!active()}
        fallback={
          <p class="py-1 w-full hover:underline hover:underline-offset-4 underline underline-offset-4 cursor-pointer">
            {props.item.title}
          </p>
        }>
        <Link
          href={href()}
          class="py-1 w-full hover:underline hover:underline-offset-4"
        >
          {props.item.title}
        </Link>
      </if>
    </li>
  )
}

export function FilterItem(props) {
  return 'path' in props.item
    ? <PathFilterItem item={props.item} />
    : <SortFilterItem item={props.item} />
}
