import clsx from 'clsx'

const dots = 'mx-[1px] inline-block h-1 w-1 animate-blink rounded-md'

export default function LoadingDots(props) {
  return (
    <span class="mx-2 inline-flex items-center">
      <span class={clsx(dots, props.class)} />
      <span class={clsx(dots, 'animation-delay-[200ms]', props.class)} />
      <span class={clsx(dots, 'animation-delay-[400ms]', props.class)} />
    </span>
  )
}


