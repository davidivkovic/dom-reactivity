import { effect, onDispose, signal, usePathname, useQuery } from 'dom-reactivity'
import { FilterItem } from './item'
import ChevronDownIcon from 'components/icons/chevron-down'

export default function FilterItemDropdown(props) {

  let ref

  const active = signal('')
  const isSelectOpen = signal(false)

  const pathname = usePathname()
  const query = useQuery()


  const handleClickOutside = (event) => {
    if (ref && !ref.contains(event.target)) {
      isSelectOpen(false)
    }
  }

  window.addEventListener('click', handleClickOutside)
  onDispose(() => window.removeEventListener('click', handleClickOutside))

  effect(() => {
    props.list.forEach((listItem) => {
      if (
        ('path' in listItem && pathname() == listItem.path) ||
        ('slug' in listItem && query().sort == listItem.slug)
      ) {
        active(listItem.title)
      }
    })
  })

  return (
    <div class="relative" ref={ref}>
      <div
        onClick={() => isSelectOpen(o => !o)}
        class="flex w-full items-center justify-between rounded border border-black/20 px-4 py-2 text-sm dark:border-white/20"
      >
        <div>{active()}</div>
        <ChevronDownIcon class="h-4" />
      </div>
      {isSelectOpen() && (
        <div
          onClick={() => isSelectOpen(false)}
          class="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {props.list.map((item, i) => (
            <FilterItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
