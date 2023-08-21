import clsx from 'clsx'
import { Link } from 'dom-reactivity'

const FooterMenuItem = ({ item }) => {
  return (
    <li>
      <Link
        href={item.path}
        exact={true}
        activeClass="text-black dark:text-neutral-300"
        class={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm',
        )}
      >
        {item.title}
      </Link>
    </li>
  )
}

export default function FooterMenu(props) {
  if (!props.menu.length) return
  return (
    <nav>
      <ul>
        <for each={props.menu}>
          {item => <FooterMenuItem key={item.title} item={item} />}
        </for>
      </ul>
    </nav>
  )
}
