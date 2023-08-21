import  PlusIcon  from 'components/icons/plus'
import clsx from 'clsx'
import { addItem } from 'components/cart/actions'
import LoadingDots from 'components/loading-dots'
import { transition } from 'lib/utils'
import { memo, useQuery } from 'dom-reactivity'

export function AddToCart(props) {

  const [isPending, startTransition] = transition()
  const searchParams = useQuery()

  const selectedVariantId = memo(() => {
    const { variants } = props
    const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined
    const variant = variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => option.value === searchParams()[option.name.toLowerCase()]
      )
    )
    return variant?.id || defaultVariantId
  })

  const title = () => !props.availableForSale
    ? 'Out of stock'
    : !selectedVariantId()
    ? 'Please select options'
    : undefined;

  return (
    <button
      aria-label="Add item to cart"
      disabled={isPending() || !props.availableForSale || !selectedVariantId()}
      title={title()}
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!props.availableForSale || !selectedVariantId()) return

        startTransition(async () => {
          const error = await addItem(selectedVariantId())

          if (error) {
            // Trigger the error boundary in the root error.js
            throw new Error(error.toString())
          }

          // router.refresh()
        })
      }}
      class={clsx(
        'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90',
        {
          'cursor-not-allowed opacity-60 hover:opacity-60': !props.availableForSale || !selectedVariantId(),
          'cursor-not-allowed': isPending()
        }
      )}
    >
      <div class="absolute left-0 ml-4">
        {!isPending() ? <PlusIcon class="h-5" /> : <LoadingDots class="mb-3 bg-white" />}
      </div>
      <span>{props.availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
    </button>
  );
}
