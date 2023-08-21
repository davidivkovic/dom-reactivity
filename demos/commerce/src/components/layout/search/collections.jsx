import clsx from "clsx"
import FilterList from "./filter"

const skeleton = "mb-3 h-4 w-4/5 animate-pulse rounded-md"
const activeAndTitles = "bg-neutral-400 dark:bg-neutral-700"
const items = "bg-neutral-300 dark:bg-neutral-800"

export default function Collections(props) {
  return (
    <if
      condition={props.collections.loading}
      enterClass="animate-fadeIn"
      fallback={
        <FilterList list={props.collections()} title="Collections" />
      }
    >
      <div class="col-span-2 hidden h-[400px] w-full flex-none py-2 lg:block">
        <div class={clsx(skeleton, activeAndTitles)} />
        <div class={clsx(skeleton, activeAndTitles)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
        <div class={clsx(skeleton, items)} />
      </div>
    </if>
  )
}
