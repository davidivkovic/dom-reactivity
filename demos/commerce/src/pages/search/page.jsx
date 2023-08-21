import Grid from 'components/grid'
import ProductGridItems from 'components/layout/product-grid-items'
import { defaultSort, sorting } from 'lib/constants'
import { getProducts } from 'lib/shopify'
import config from 'lib/config'
import { resource, useQuery } from 'dom-reactivity'

const { SITE_NAME } = config

export default function SearchResults(props) {

  const query = useQuery()
  const searchValue = () => query().q

  const [products] = resource(
    () => {
      const { sort, q: searchValue } = query()
      const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort
      return { sortKey, reverse, searchValue }
    },
    options => getProducts(options)
  )
  
  const resultsText = () => products().length > 1 ? 'results' : 'result'

  document.title = `Search | ${SITE_NAME}"`

  return (
    <if condition={!products.loading}>
      {searchValue() ? (
        <p class="mb-4">
          {products().length === 0
            ? 'There are no products that match '
            : `Showing ${products().length} ${resultsText()} for `}
          <span class="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products().length > 0 ? (
        <Grid class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products()} />
        </Grid>
      ) : null}
    </if>
  )
}
