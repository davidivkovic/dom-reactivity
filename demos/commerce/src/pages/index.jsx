import { ThreeItemGrid } from 'components/grid/three-items'
import { Carousel } from 'components/carousel'
import { getCollectionProducts } from 'lib/shopify'
import config from 'lib/config'
import { resource } from 'dom-reactivity'

const { SITE_NAME } = config

export function IndexData({ preloaded }) {

  const fetcher = async () => {
    const [featured, carousel] = await Promise.all([
      getCollectionProducts({ collection: 'homepage-featured' }),
      getCollectionProducts({ collection: 'homepage-carousel' })
    ])
    return { featured, carousel }
  }

  const [data] = resource(() => {}, fetcher, { preloaded })
  return data
}

export default function Index(props) {

  const data = props.data

  document.title = SITE_NAME

  return (
    <>
      <ThreeItemGrid loading={data.loading} products={data()?.featured} />
      <Carousel loading={data.loading} products={data()?.carousel} />
    </>
  )
}