import { getCart } from 'lib/shopify'
import cookies from 'lib/cookies'
import CartModal from './modal'
import OpenCart from './open-cart'
import { effect, resource, signal } from 'dom-reactivity'

export default function Cart() {

  const loaded = signal(false)
  const [cart] = resource(
    () => cookies().get('cartId')?.value,
    async cartId => {
      const cart = cartId && await getCart(cartId)
      return () => cart
    }
  )

  effect(() => !cart.loading && loaded(true))

  return (
    <if condition={loaded()} fallback={<OpenCart />}>
      <CartModal cart={cart()} />
    </if>
  )
}