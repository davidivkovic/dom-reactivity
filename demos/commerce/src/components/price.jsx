import clsx from 'clsx';

export default function Price(props) {
  props.currentCode ??= 'USD'

  return (
    <p class={props.class}>
      {`${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: props.currencyCode,
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(props.amount))}`}
      <span class={clsx('ml-1 inline', props.currencyCodeClass)}>{`${props.currencyCode}`}</span>
    </p>
  )
}

