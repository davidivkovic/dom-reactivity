import clsx from 'clsx'
import Label from 'components/label'

export function GridTileImage(props) {
  return (
    <div
      class={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black',
        {
          relative: props.label,
          'border-2 border-blue-600': props.active,
          'border-neutral-200 dark:border-neutral-800': !props.active
        }
      )}
    >
      {props.src ? (
        <img
          class={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': props.isInteractive
          })}
          {...props}
        />
      ) : null}
      {props.label ? (
        <Label
          title={props.label.title}
          amount={props.label.amount}
          currencyCode={props.label.currencyCode}
          position={props.label.position}
        />
      ) : null}
    </div>
  )
}
