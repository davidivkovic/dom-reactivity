import { Link } from 'dom-reactivity'
import { GridTileImage } from 'components/grid/tile'
import Grid from 'components/grid'

export default function ProductGridItems(props) {
  return (
    <>
      {props.products.map((product) => (
        <Grid.Item class="animate-fadeIn">
          <Link class="relative inline-block h-full w-full" href={`/product/${product.handle}`}>
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  )
}
