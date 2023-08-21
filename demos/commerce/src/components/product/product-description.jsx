import { AddToCart } from 'components/cart/add-to-cart'
import Price from 'components/price'
import Prose from 'components/prose'
import { VariantSelector } from './variant-selector'

export function ProductDescription(props) {
  return (
    <>
      <div class="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 class="mb-2 text-5xl font-medium">{props.product.title}</h1>
        <div class="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={props.product.priceRange.maxVariantPrice.amount}
            currencyCode={props.product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={props.product.options} variants={props.product.variants} />

      {props.product.descriptionHtml ? (
        <Prose
          class="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={props.product.descriptionHtml}
        />
      ) : null}

      <AddToCart variants={props.product.variants} availableForSale={props.product.availableForSale} />
    </>
  );
}
