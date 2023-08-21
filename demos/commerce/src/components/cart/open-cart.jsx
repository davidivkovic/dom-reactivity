import ShoppingCartIcon from 'components/icons/shopping-cart'
import clsx from 'clsx'

export default function OpenCart(props) {
  return (
    <div class="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white cursor-pointer">
      <ShoppingCartIcon
        class={clsx('h-4 transition-all ease-in-out hover:scale-110 ', props.class)}
      />

      <if condition={props.quantity}>
        <div class="absolute flex items-center justify-center right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
          {props.quantity}
        </div>
      </if>
    </div>
  )
}