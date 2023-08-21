import Collections from 'components/layout/search/collections'
import FilterList from 'components/layout/search/filter'
import { sorting } from 'lib/constants'
import { getCollections } from 'lib/shopify'
import { resource } from "dom-reactivity"

export function LayoutData({ preloaded }) {
  const [collections] = resource(() => { }, getCollections, { preloaded })
  return collections
}

export default function SearchLayout(props) {
  return (
    <div class="mx-auto flex max-w-screen-2xl flex-col gap-4 md:gap-8 px-4 pb-4 text-black dark:text-white md:flex-row">
      <div class="order-first w-full flex-none md:max-w-[125px]">
        <Collections collections={props.data} />
      </div>
      <div class="order-last min-h-screen w-full md:order-none">{props.children}</div>
      <div class="order-none flex-none md:order-last md:w-[125px]">
        <FilterList list={sorting} title="Sort by" />
      </div>
    </div>
  )
}
