
import Grid from "components/grid"
import Loading from "./loading"
import ProductGridItems from "components/layout/product-grid-items"
import { defaultSort, sorting } from "lib/constants"
import { getCollectionProducts } from 'lib/shopify'
import { resource } from "dom-reactivity"

export function CollectionData({ params, queryParams, preloaded }) {

  const [products] = resource(
    () => {
      const { c: collection } = params()
      const { sortKey, reverse } = sorting.find(item => item.slug === queryParams().sort) || defaultSort
      return { collection, sortKey, reverse }
    },
    options => options.collection ? getCollectionProducts(options) : Promise.resolve([]),
    { preloaded }
  )

  return products
}

export default function Collection(props) {

  const products = props.data

  return (
    <if condition={!products.loading} fallback={<Loading />}>
      <section>
        <if
          condition={products().length}
          fallback={
            <p class="py-3 text-lg">{`No products found in this collection`}</p>
          }
        >
          <Grid class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products()} />
          </Grid>
        </if>
      </section>
    </if>
  )
}