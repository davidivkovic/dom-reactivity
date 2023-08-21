import XMarkIcon from 'components/icons/x-mark'
import LoadingDots from 'components/loading-dots'

import clsx from 'clsx'
import { removeItem } from 'components/cart/actions'
import { transition } from 'lib/utils'

export default function DeleteItemButton({ item }) {
  
  const [isPending, startTransition] = transition()

  return (
    <button
      aria-label="Remove cart item"
      onClick={() => {
        startTransition(async () => {
          const error = await removeItem(item.id)

          if (error) {
            throw new Error(error.toString());
          }

          // router.refresh();
        })
      }}
      disabled={isPending()}
      class={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': isPending()
        }
      )}
    >
      {isPending() ? (
        <LoadingDots class="bg-white" />
      ) : (
        <XMarkIcon class="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  )
}
