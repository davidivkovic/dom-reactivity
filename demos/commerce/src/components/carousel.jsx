import { GridTileImage } from 'components/grid/tile'
import { Link, effect } from 'dom-reactivity'

function LoadingItems() {
  return (
    <for each={Array(10).fill(0)}>
      {() => <li class="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3 rounded-lg animate-pulse bg-neutral-100 dark:bg-neutral-900" />}
    </for>
  )
}

export function Carousel(props) {

  const carouselProducts = () => props.products
    ? [
      ...props.products,
      ...props.products,
      ...props.products
    ]
    : []

  return (
    <div class=" w-full overflow-x-auto pb-6 pt-1">
      <ul class="flex animate-carousel gap-4">
        {props.loading
          ? <LoadingItems />
          : <for each={carouselProducts()}>
            {product => (
              <li class="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3">
                <Link href={`/product/${product.handle}`} class="relative h-full w-full">
                  <GridTileImage
                    alt={product.title}
                    label={{
                      title: product.title,
                      amount: product.priceRange.maxVariantPrice.amount,
                      currencyCode: product.priceRange.maxVariantPrice.currencyCode
                    }}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                </Link>
              </li>
            )}
          </for>
        }
      </ul>
    </div>
  )
}
