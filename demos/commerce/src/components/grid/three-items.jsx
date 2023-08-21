import { GridTileImage } from './tile'
import { Link } from 'dom-reactivity'

function LoadingItem(props) {
  const { size } = props
  return (
    <div class={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'} >
      <div class="relative block aspect-square h-full w-full rounded-lg animate-pulse bg-neutral-100 dark:bg-neutral-900" />
    </div>
  )
} 

function GridItem(props) {
  const { item, size, priority } = props
  return (
    <div
      class={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link class="relative block aspect-square h-full w-full" href={`/product/${item.handle}`}>
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>
  )
}

export function ThreeItemGrid(props) {
  return (
    <section class="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <if condition={props.loading}>
        <LoadingItem size="full" />
        <LoadingItem size="half" />
        <LoadingItem size="half" />
      </if>
      <if condition={props.products?.length >=3}>
        <GridItem size="full" item={props.products[0]} priority={true} />
        <GridItem size="half" item={props.products[1]} priority={true} />
        <GridItem size="half" item={props.products[2]} />
      </if>
    </section>
  )
}
