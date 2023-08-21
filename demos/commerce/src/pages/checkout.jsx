import Prose from 'components/prose'
import config from 'lib/config'

const { SITE_NAME } = config

export default function Page() {

  const page = {
    title: 'Checkout',
    body: `
      Checkout is not implemented yet in this integration. Check out 
      <a href="https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-checkout-flow">our guide on implementing a checkout flow</a>
      to learn more.
    `,
    updatedAt: 1690000000000
  }

  document.title = `${page.title} | ${SITE_NAME}`

  return (
    <div class="w-full">
      <div class="mx-8 max-w-2xl py-20 sm:mx-auto">
        <h1 class="mb-8 text-5xl font-bold">{page.title}</h1>
        <Prose class="mb-8" html={page.body} />
        <p class="text-sm">
          {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(page.updatedAt))}.`}
        </p>
      </div>
    </div>
  )
}