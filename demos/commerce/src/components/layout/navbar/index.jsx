import { Link } from 'dom-reactivity'
import config from 'lib/config'
import LogoSquare from 'components/logo-square'
import Search from './search'
import Cart from 'components/cart'
import MobileMenu from './mobile-menu'

const { SITE_NAME, headerMenu: menu } = config

export default function Navbar() {
  return (
    <nav class="relative flex items-center justify-between p-4 lg:px-6">
      <div class="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>
      <div class="flex w-full items-center">
        <div class="flex w-full md:w-1/3">
          <Link
            href="/"
            aria-label="Go back home"
            class="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div class="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul class="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    class="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div class="hidden justify-center md:flex md:w-1/3">
          <Search />
        </div>
        <div class="flex justify-end md:w-1/3">
          <Cart/>
        </div>
      </div>
    </nav>
  );
}
