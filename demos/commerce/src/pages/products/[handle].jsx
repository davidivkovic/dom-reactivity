import { GridTileImage } from 'components/grid/tile'
import { Gallery } from 'components/product/gallery'
import { ProductDescription } from 'components/product/product-description'
import { getProduct, getProductRecommendations } from 'lib/shopify'
import config from 'lib/config'
import { Link, effect, resource } from 'dom-reactivity'

const { SITE_NAME } = config

export function ProductData({ params, preloaded }) {

  const fetcher = async handle => {
    if (!handle) return
    const [product, relatedProducts] = await Promise.all([
      getProduct(handle),
      getProductRecommendations(handle)
    ])
    return { product, relatedProducts }
  }

  const [data] = resource(() => params().handle, fetcher, { preloaded })
  return data
}

export default function ProductPage(props) {

  const data = props.data

  effect(() => data()?.product && (document.title = `${data().product.title} | ${SITE_NAME}`))

  return (
    <if condition={data()?.product}>
      <div class="mx-auto max-w-screen-2xl px-4">
        <div class="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div class="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={data().product.images.map((image) => ({
                src: image.url,
                altText: image.altText
              }))}
            />
          </div>
          <div class="basis-full lg:basis-2/6">
            <ProductDescription product={data().product} />
          </div>
        </div>
        <RelatedProducts products={data().relatedProducts} />
      </div>
    </if>
  )
}

function RelatedProducts(props) {
  return (
    <div class="py-8">
      <h2 class="mb-4 text-2xl font-bold">Related Products</h2>
      <ul class="flex w-full gap-4 overflow-x-auto pt-1">
        {props.products.map(product => (
          <li
            key={product.handle}
            class="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link class="relative h-full w-full" href={`/product/${product.handle}`}>
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}