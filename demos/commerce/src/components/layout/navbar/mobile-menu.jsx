import Bars3Icon from 'components/icons/bars3'
import XMarkIcon from 'components/icons/x-mark'
import Search from './search'
import { Link, usePathname, useQuery, signal, effect, onDispose } from 'dom-reactivity'

export default function MobileMenu(props) {

  const menu = props.menu

  const pathname = usePathname()
  const searchParams = useQuery()

  const isOpen = signal(false)
  const openMobileMenu = () => isOpen(true)
  const closeMobileMenu = () => isOpen(false)

  const handleResize = () => {
    if (window.innerWidth > 768) {
      closeMobileMenu()
    }
  }

  window.addEventListener('resize', handleResize)
  onDispose(() => window.removeEventListener('resize', handleResize))

  effect(() => {
    pathname()
    searchParams()
    closeMobileMenu()
  })

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        class="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white md:hidden"
      >
        <Bars3Icon class="h-4" />
      </button>
        <div class="relative z-50">
          <if condition={isOpen()} enterClass="animate-fadeIn" exitClass="animate-fadeOut">
            <div onClick={closeMobileMenu} class="fixed inset-0 bg-black/30 backdrop-blur-[.5px]" aria-hidden="true" />
          </if>
          <if condition={isOpen()} enterClass="animate-slide-in" exitClass="animate-slide-out">
            <div class="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div class="p-4">
                <button
                  class="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon class="h-6" />
                </button>

                <div class="mb-4 w-full">
                  <Search />
                </div>
                {menu.length ? (
                  <ul class="flex w-full flex-col">
                    {menu.map((item) => (
                      <li
                        class="flex py-2 text-black transition-colors hover:text-neutral-500 dark:text-white"
                        key={item.title}
                      >
                        <Link href={item.path} onClick={closeMobileMenu} class="flex-1">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </if>
        </div>
    </>
  )
}
