import ArrowLeftIcon from 'components/icons/arrow-left'
import ArrowRightIcon from 'components/icons/arrow-right'
import { GridTileImage } from 'components/grid/tile'
import { createUrl } from 'lib/utils'
import { Link, memo, usePathname, useQuery } from 'dom-reactivity'

export function Gallery(props) {
  const pathname = usePathname()
  const searchParams = useQuery()

  const imageIndex = memo(() => {
    const imageSearchParam = searchParams().image
    return imageSearchParam ? parseInt(imageSearchParam) : 0
  })

  const nextSearchParams = new URLSearchParams(searchParams())
  const previousSearchParams = new URLSearchParams(searchParams())

  const nextUrl = memo(() => {
    const nextImageIndex = imageIndex() + 1 < props.images.length ? imageIndex() + 1 : 0
    nextSearchParams.set('image', nextImageIndex.toString())
    return createUrl(pathname(), nextSearchParams)
  })

  const previousUrl = memo(() => {
    const previousImageIndex = imageIndex() === 0 ? props.images.length - 1 : imageIndex() - 1
    previousSearchParams.set('image', previousImageIndex.toString())
    return createUrl(pathname(), previousSearchParams)
  })

  const buttonclass =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <>
      <div class="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {props.images[imageIndex()] && (
          <img
            class="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={props.images[imageIndex()]?.altText}
            src={props.images[imageIndex()]?.src}
            priority={true}
          />
        )}

        {props.images.length > 1 ? (
          <div class="absolute bottom-[15%] flex w-full justify-center">
            <div class="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                href={previousUrl()}
                class={buttonclass}
                scroll={false}
              >
                <ArrowLeftIcon class="h-5" />
              </Link>
              <div class="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link
                aria-label="Next product image"
                href={nextUrl()}
                class={buttonclass}
                scroll={false}
              >
                <ArrowRightIcon class="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {props.images.length > 1 ? (
        <ul class="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {props.images.map((image, index) => {
            const isActive = index === imageIndex()
            const imageSearchParams = new URLSearchParams(searchParams())

            imageSearchParams.set('image', index.toString())

            return (
              <li key={image.src} class="h-20 w-20">
                <Link
                  aria-label="Enlarge product image"
                  href={createUrl(pathname(), imageSearchParams)}
                  scroll={false}
                  class="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  )
}
