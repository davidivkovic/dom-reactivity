import clsx from 'clsx'

function Grid(props) {
  return (
    <ul {...props} class={clsx('grid grid-flow-row gap-4', props.class)}>
      {props.children}
    </ul>
  );
}

function GridItem(props) {
  return (
    <li {...props} class={clsx('aspect-square transition-opacity', props.class)}>
      {props.children}
    </li>
  );
}

Grid.Item = GridItem

export default Grid
