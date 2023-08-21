import FilterItemDropdown from './dropdown'
import { FilterItem } from './item'

export default function FilterList(props) {
  return (
    <>
      <nav>
        {props.title ? <h3 class="hidden text-xs text-neutral-500 md:block mb-1">{props.title}</h3> : null}
        <ul class="hidden md:block">
          {props.list.map((item, i) => (
            <FilterItem key={i} item={item} />
          ))}
        </ul>
        <ul class="md:hidden">
          <FilterItemDropdown list={props.list} />
        </ul>
      </nav>
    </>
  );
}
