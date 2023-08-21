import ShoppingCartIcon from 'components/icons/shopping-cart'
import Price from 'components/price'
import CloseCart from './close-cart'
import DeleteItemButton from './delete-item-button'
import EditItemQuantityButton from './edit-item-quantity-button'
import OpenCart from './open-cart'
import { DEFAULT_OPTION } from 'lib/constants'
import { createUrl } from 'lib/utils'
import { signal, memo, Link, effect, untrack, usePathname } from 'dom-reactivity'

export default function CartModal(props) {

  const pathname = usePathname()
  const isOpen = signal(false)
  const openCart = () => isOpen(true)
  const closeCart = () => isOpen(false)

  const cart = memo(() => props.cart?.())
  let quantity = cart()?.totalQuantity

  effect(() => {
    const newQuantity = cart()?.totalQuantity
    if (newQuantity !== quantity) {
      !untrack(isOpen) && openCart()
      quantity = newQuantity
    }
  })

  effect(() => {
    pathname()
    if (isOpen()) {
      document.body.style.position = 'fixed';
      document.body.style.inset = '0'
      document.body.style.top = `-${window.scrollY}px`;
      if (document.body.scrollHeight > document.body.clientHeight && window.innerWidth > 768) {
        document.body.style.right = '15px'
      }
      else {
        document.body.style.right = '0px'
      }
    }
    else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = '';
      document.body.style.right = '0px'
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  })

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart()?.totalQuantity} />
      </button>
      <div class="relative z-50">
        <if condition={isOpen()} enterClass="animate-fadeIn" exitClass="animate-fadeOut">
          <div onClick={closeCart} class="fixed inset-0 bg-black/30 backdrop-blur-[.5px]" aria-hidden="true" />
        </if>
        <if condition={isOpen()} enterClass="animate-slide-in" exitClass="animate-slide-out">
          <div class="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]">
            <div class="flex items-center justify-between">
              <p class="text-lg font-semibold">My Cart</p>

              <button aria-label="Close cart" onClick={closeCart}>
                <CloseCart />
              </button>
            </div>

            {!cart() || cart().lines.length === 0 ? (
              <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                <ShoppingCartIcon class="h-16" />
                <p class="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
              </div>
            ) : (
              <div class="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul class="flex-grow overflow-auto py-4">
                  {cart().lines.map((item, i) => {
                    const merchandiseSearchParams = {}
                    item.merchandise.selectedOptions.forEach(({ name, value }) => {
                      if (value !== DEFAULT_OPTION) {
                        merchandiseSearchParams[name.toLowerCase()] = value
                      }
                    })

                    const merchandiseUrl = createUrl(
                      `/product/${item.merchandise.product.handle}`,
                      new URLSearchParams(merchandiseSearchParams)
                    )

                    return (
                      <li
                        key={i}
                        class="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                      >
                        <div class="relative flex w-full flex-row justify-between px-1 py-4">
                          <div class="absolute z-40 -mt-2 ml-[55px]">
                            <DeleteItemButton item={item} />
                          </div>
                          <Link
                            href={merchandiseUrl}
                            onClick={closeCart}
                            class="z-30 flex flex-row space-x-4"
                          >
                            <div class="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              <img
                                class="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={
                                  item.merchandise.product.featuredImage.altText ||
                                  item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            </div>

                            <div class="flex flex-1 flex-col text-base">
                              <span class="leading-tight">
                                {item.merchandise.product.title}
                              </span>
                              {item.merchandise.title !== DEFAULT_OPTION ? (
                                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                                  {item.merchandise.title}
                                </p>
                              ) : null}
                            </div>
                          </Link>
                          <div class="flex h-16 flex-col justify-between">
                            <Price
                              class="flex justify-end space-y-2 text-right text-sm"
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                            />
                            <div class="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                              <EditItemQuantityButton item={item} type="minus" />
                              <p class="w-6 text-center">
                                <span class="w-full text-sm">{item.quantity}</span>
                              </p>
                              <EditItemQuantityButton item={item} type="plus" />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div class="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <div class="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                    <p>Taxes</p>
                    <Price
                      class="text-right text-base text-black dark:text-white"
                      amount={cart().cost.totalTaxAmount.amount}
                      currencyCode={cart().cost.totalTaxAmount.currencyCode}
                    />
                  </div>
                  <div class="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                    <p>Shipping</p>
                    <p class="text-right">Calculated at checkout</p>
                  </div>
                  <div class="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                    <p>Total</p>
                    <Price
                      class="text-right text-base text-black dark:text-white"
                      amount={cart().cost.totalAmount.amount}
                      currencyCode={cart().cost.totalAmount.currencyCode}
                    />
                  </div>
                </div>
                <Link
                  href={cart().checkoutUrl}
                  onClick={closeCart}
                  class="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </if>
      </div>
    </>
  )
}
