import { memo, navigateTo, useQuery } from 'dom-reactivity'
import { createUrl } from 'lib/utils'
import MagnifyingGlassIcon from 'components/icons/magnifying-glass'

export default function Search() {

  const query = useQuery()
  const searchValue = memo(() => query().q ?? '')

  function onSubmit(e) {
    e.preventDefault()

    const val = e.target
    const search = val.search
    const path = search.value ? '/search/results' : '/search/all'
    const newParams = new URLSearchParams(query())

    if (search.value) {
      newParams.set('q', search.value)
    } else {
      newParams.delete('q')
    }


    navigateTo(createUrl(path, newParams))
  }

  return (
    <form onSubmit={onSubmit} class="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        type="text"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        value={searchValue()}
        onChange={(e) => searchValue(e.target.value)}
        class="w-full rounded-lg border bg-white px-4 md:text-sm py-2 text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div class="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon class="h-4" />
      </div>
    </form>
  )
}
