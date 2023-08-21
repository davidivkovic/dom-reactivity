import { transition } from 'lib/utils'

import MinusIcon from 'components/icons/minus'
import PlusIcon from 'components/icons/plus'
import clsx from 'clsx';
import { removeItem, updateItemQuantity } from 'components/cart/actions'
import LoadingDots from 'components/loading-dots'

export default function EditItemQuantityButton(props) {

  const [isPending, startTransition] = transition()

  return (
    <button
      aria-label={props.type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      onClick={() => {
        startTransition(async () => {
          const { item, type } = props
          const error =
            type === 'minus' && item.quantity - 1 === 0
              ? await removeItem(item.id)
              : await updateItemQuantity({
                  lineId: item.id,
                  variantId: item.merchandise.id,
                  quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
                })

          if (error) {
            // Trigger the error boundary in the root error.js
            throw new Error(error.toString())
          }

          // router.refresh()
        })
      }}
      disabled={isPending()}
      class={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': isPending(),
          'ml-auto': props.type === 'minus'
        }
      )}
    >
      {isPending() ? (
        <LoadingDots class="bg-black dark:bg-white" />
      ) : props.type === 'plus' ? (
        <PlusIcon class="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon class="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
